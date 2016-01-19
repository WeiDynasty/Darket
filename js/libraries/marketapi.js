"use strict"
var EventEmitter = require('wolfy87-eventemitter')
var asyncjs = require('async')

function asObj(str,done){
  if(str.toString) str = str.toString()
  if(typeof str === 'string'){
    var obj
    try {
      obj = JSON.parse(str)
    } catch (e) {
      console.log('error parsing:',str,'Error:',e)
      return done(e,undefined)
    }
    done(null,obj)
  } else {
    console.log('not string:',str)
    done('not string: '+str,undefined)
  }
}

function replyAsObj(res,isJson,done){
  if(res.readable){
    // Is a stream
    console.log('got stream')
    res.setEncoding('utf8')
    var data = ''
    res.on('data',d => {
      console.log('got stream data:',d)
      data += d
    })
    res.on('end',() => {
      if(isJson) {
        asObj(data,done)
      } else {
        done(null,data)
      }
    })
  } else if(res.split || res.toString){
    //console.log('got string or buffer:',res)
    if(res.toString) res = res.toString()
    // Is a string
    if(isJson){
      asObj(res,done)
    } else {
      done(null,res)
    }
  }
}

function MarketAPI(ipfs, web3){
  this.ipfs = ipfs
  this.web3 = web3
  this.version = 'dev'
  this.baseurl = '/market-account/'
  this.users = {} // userID : profileHash
  this.resolving_ipns = {} // to check if a resolve is already in progress
  this.ee = new EventEmitter()
  if(localStorage !== undefined){
    // Use localStorage to store the IPNS cache
    var stored = localStorage.getItem('market-user-cache')
    try {
      this.users = JSON.parse(stored)
      if(this.users === null || this.users === undefined){
        this.users = {}
      }
    } catch(e){
      this.users = {}
    }
  }
}
// Rewrote this to use event emitters. Should also add periodic rechecking
MarketAPI.prototype.resolveIPNS = function(n,handler){
  if(this.resolving_ipns[n] != true){
    this.resolving_ipns[n] = true
    this.ipfs.name.resolve(n,(err,r) => {
      if(err){
        swal({   
            title: "Error!",   
            text: 'Could not resolve IPNS Data',   
            type: "error",   
            confirmButtonText: "Close" 
          });
      } else {
        console.log('IPNS Data Hash Path: ' + r.Path)
        this.idhash = r.Path
        var url = r.Path
        if(url === undefined){
          console.log('Could not resolve',n)
        } else this.isUserProfile(url,(isit,err) => {
          //this was getting pulled from temp storage
          //else if(this.users[n] != url) this.isUserProfile(url,(isit,err) => {
          if(isit){
            this.ee.emit('initdone',undefined)
            this.ee.removeEvent('initdone')
          } else {
            console.log('failed to sign in')
          }
          this.resolving_ipns[n] = false
          return true // Remove from listeners
        })
      }
    })
  }
  return this.ee
}

MarketAPI.prototype.isUserProfile = function(addr,done){
  if(addr === undefined) return console.log('Asked to check if undefined is a profile')
  this.ipfs.cat(addr+this.baseurl+'user.txt',(err,r) => {
    if(err){
      swal({   
              title: "Error!",   
              text: 'You do not have an account yet, please create one',   
              type: "error",   
              confirmButtonText: "Close" 
      });
      done(false)
    }
      if(r == this.version){
        console.log(this.checkForEthereum())
        if(this.checkForEthereum()){
        console.log('Account Found With Mathcing Version: ' + r)
        done(true)
      }else{
        done(false)
      }
    }
  })
}

MarketAPI.prototype.searchUsers = function(){
  // Look at our peers
  this.ipfs.swarm.peers((err,r) => {
    if(err) return console.log(err)
    replyAsObj(r,true,(e,reply) => {
      if(e){
        this.ee.emit('error',e)
        return console.log('There was an error while getting swarm peers:',e)
      }
      console.log('Checking',reply.Strings.length,'peers')
      //reply.Strings.forEach(item => {
      var f = (item, done) => {
        var ss = item.split('/')
        var n = ss[ss.length-1]
        this.ee.once(n,(res,err) => done(err))
        this.resolveIPNS(n)
      }
      asyncjs.eachSeries(reply.Strings,f.bind(this))
    })
  })
  // Look for who has the correct version file, they probably have a profile
  /*
  this.ipfs.dht.findprovs(this.version_hash, (err,res) => {
    if(err){
      console.log('DHT FINDPROVS err',err)
    } else if(res.readable){
      console.log('DHT FINDPROVS stream',res)
    } else {
      console.log('DHT FINDPROVS string',res)
    }
  })*/
  return this.ee
}

MarketAPI.prototype.getProfile = function(userID,done){
  this.resolveIPNS(userID,(url,err) => {
    if(err){
      this.ee.emit('error',err)
      done(err,null)
    } else {
      // Download actual profile
      this.ipfs.cat(url+this.baseurl+'profile.json',(err2,res) => {
        if(err2){
          this.ee.emit('error',err2)
          done(err2,null)
        } else {
          // TODO: JSON parse error handling
          var p = JSON.parse(res.toString())
          this.ee.emit('profile for '+userID,p)
          done(null,p)
        }
      })
      // Get other info
      this.ipfs.ls(url+this.baseurl+'boards/',(err2,res) => {
        if(!err2){
          var l = res.Objects[0].Links.map(i => {
            return { name: i.Name, hash: i.Hash }
          })
          this.ee.emit('boards for '+userID,l)
        } else {
          this.ee.emit('error',err2)
        }
      })
    }
    return true // remove myself from listeners
  })
  return this.ee
}

MarketAPI.prototype.getBoardSettings = function(userID,board){
  if(!userID){
    return console.log('Invalid USERID',userID)
  }
  if(!board){
    return console.log('Invalid BOARD',board)
  }
  this.resolveIPNS(userID,(r,e) => {
    if(e){
      this.ee.emit('error',e)
    } else {
      var url = r+this.baseurl+'boards/'+board+'/settings.json'
      this.ipfs.cat(url,(err,resp) => {
        // TODO: error handling json conversion
        var settings = JSON.parse(resp.toString())
        if(err){
          this.ee.emit('error',err)
        } else {
          // SETTINGS file is here, need to parse it a little bit
          this.ee.emit('settings for '+board+'@'+userID,settings,r)
          if(settings.whitelist == true){
            // Get the whitelist
            var url = r+this.baseurl+'boards/'+board+'/whitelist'
            this.ipfs.cat(url,(err,res) => {
              if(err){
                this.ee.emit('error',err)
                // Emit an empty whitelist.
                this.ee.emit('whitelist for '+board+'@'+userID,[])
              } else replyAsObj(res,false,(err,whitelist) => {
                // Send whitelist
                var w = whitelist.split(' ').map(x => x.trim())
                this.ee.emit('whitelist for '+board+'@'+userID,w)
              })
            })
          }
          if(!settings.whitelist_only && !settings.approval_required && settings.blacklist == true){
            // Get the blacklist
            var u = r+this.baseurl+'boards/'+board+'/blacklist'
            this.ipfs.cat(u,(err,blacklist) => {
              if(err){
                this.ee.emit('error',err)
              } else {
                // Send blacklist
                var w = blacklist.split(' ')
                this.emit('blacklist for '+board+'@'+userID,w)
              }
            })
          }
        }
      })
    }
    return true // remove myself from listeners
  })
  return this.ee
}

MarketAPI.prototype.downloadPost = function(hash,adminID,board,op,done){
  console.log('Downloading post',hash)
  this.ipfs.cat(hash,(err2,r) => {
    if(err2){
      this.ee.emit('error',err2)
      console.log('Could not download post',hash,'of',board+'@'+adminID)
      if(done && done.apply) done(err2)
    } else {
      replyAsObj(r,true,(err,post) => {
        // TODO: add JSON parsing error handling
        post.hash = hash
        if(op) post.op = op // Inject op
        if(board){
          if(adminID) this.ee.emit('post in '+board+'@'+adminID,post,hash)
          else this.ee.emit('post in '+board,post,hash)
        }
        this.ee.emit(hash,post,adminID,board)
        if(done && done.apply) done(null,post)
      })
    }
  })
  return this.ee
}

MarketAPI.prototype.retrieveListOfApproved = function(what,addr,adminID,board){
  var a = addr+this.baseurl+'boards/'+board+'/approved/'+what+'/'
  this.ipfs.ls(a,(err,res) => {
    if(err){
      this.ee.emit('error',err)
    } else {
      // Send approved posts list
      var ret = res.Objects[0].Links.map(item => {
        return { date: item.Name, hash: item.Hash }
      })
      this.emit('approved '+what+' for '+board+'@'+adminID,ret)
    }
  })
}

MarketAPI.prototype.getAllowedContentProducers = function(adminID,board,options){
  if(!options) return
  this.ee.on('settings for '+board+'@'+adminID,function(settings,addr){
    // Get stuff based on settings
    if(settings.approval_required == true){
      // Get approved posts list
      if(options.posts) this.retrieveListOfApproved('posts',addr,adminID,board)
      // Get approved comments list
      if(options.comments) this.retrieveListOfApproved('comments',addr,adminID,board)
    } else if(settings.whitelist_only == true){
      // TODO: emit all whitelisted users
    } else if(settings.blacklist == true){
      // TODO: emit all users not in the blacklist
    }
  })
  this.getBoardSettings(adminID,board)
  return this.ee
}

MarketAPI.prototype.getPostsInBoard = function(adminID,board){
  if(adminID){
    this.ee.on('approved posts for '+board+'@'+adminID,ret => {
      // Automatically download approved posts
      ret.forEach(item => this.downloadPost(item.hash,adminID,board))
    })
    this.ee.on('whitelist for '+board+'@'+adminID, whitelist => {
      // download posts for each user in whitelist
      whitelist.forEach(item => {
        this.getUserPostListInBoard(item,board,(err,postList) => {
          postList.forEach( i => this.downloadPost(i.hash,adminID,board,item))
        })
      })
    })
    // Get allowed content and content producers
    this.getAllowedContentProducers(adminID,board,{ posts: true })
    // Get the admin's posts
    this.getUserPostListInBoard(adminID,board,(err,res) => {
      if(err){
        console.log(err)
      } else res.forEach(item => this.downloadPost(item.hash,adminID,board,adminID))
    })
  } else {
    // TODO: Download all posts in board from everyone
    // Download my posts
    this.getUserPostListInBoard(this.id,board,(err,res) => {
      if(err){
        console.log(err)
      } else res.forEach(item => this.downloadPost(item.hash,undefined,board,this.id))
    })
  }
  return this.ee
}

MarketAPI.prototype.getUserPostListInBoard = function(user,board,done){
  this.resolveIPNS(user,(url,err) => {
    if(err){
      this.ee.emit('error',err)
      done(err)
    } else this.ipfs.ls(url+this.baseurl+'posts/'+board,(e,r) => {
      if(e){
        this.ee.emit('error',e)
        done(e)
      } else if(r && !r.split){
        console.log('Found',r.Objects[0].Links.length,'posts in',board,'at',user)
        this.ee.emit('post count',board,user,r.Objects[0].Links.length)
        var l = r.Objects[0].Links.map(i => {
          return { date: i.Name, hash: i.Hash }
        })
        done(null,l)
      }
    })
    return true // remove myself from listeners
  })
  return this.ee
}

MarketAPI.prototype.downloadComment = function(hash,adminID,board,done){
  this.ipfs.cat(hash,(err2,r) => {
    if(err2){
      this.ee.emit('error',err2)
      console.log('Could not download comment',hash,'of',board+'@'+adminID)
      if(done && done.apply) done(err2)
    } else {
      // TODO: add JSON parsing error handling
      var cmnt = JSON.parse(r.toString())
      cmnt.hash = hash
      this.ee.emit(hash,cmnt,adminID,board)
      this.ee.emit('comment for '+cmnt.parent,cmnt)
      if(done && done.apply) done(null,cmnt)
    }
  })
  return this.ee
}

MarketAPI.prototype.getCommentsFor = function(parent,board,adminID){
  if(!parent || !board || !adminID){
    return console.log('malformed arguments:',parent,board,adminID)
  }
  this.ee.on('approved comments for '+board+'@'+adminID,ret => {
    ret.forEach(item => this.downloadComment(item.hash,adminID,board))
  })
  // get the admin's comments
  this.getUserCommentList(parent,adminID,(err,res) => {
    if(!err){
      res.forEach(item => this.downloadComment(item.hash,adminID,board))
    }
  })
  this.getAllowedContentProducers(adminID,board,{ comments: true })
}

MarketAPI.prototype.getUserCommentList = function(parent,user,done){
  if(!parent || !user){
    return console.log('Malformed arguments:',parent,user)
  }
  this.resolveIPNS(user,(url,err) => {
    if(err){
      this.ee.emit('error',err)
      done(err)
    } else this.ipfs.ls(url+this.baseurl+'comments/'+parent,(e,r) => {
      if(e){
        this.ee.emit('error',e)
        done(e)
      } else if(r && !r.split){
        if(r.Objects && r.Objects[0]){ // If this is not true, then there are no comments
          console.log('Found',r.Objects[0].Links.length,'comments for',parent,'at',user)
          var l = r.Objects[0].Links.map(i => {
            return { date: i.Name, hash: i.Hash }
          })
          done(null,l)
        }
      }
    })
    return true // remove myself from listeners
  })
  return this.ee
}

MarketAPI.prototype.checkForEthereum = function(){
  var self = this
  if(!web3.isConnected()) {
    swal({   
            title: "Error!",   
            text: 'Geth account is not connected.',   
            type: "error",   
            confirmButtonText: "Close" 
          });
    return false
  } else {
    return true
  }
}

// API for publishing content and managing to be done later...

// Initialize API
MarketAPI.prototype.init = function(done){
  if(this.isInit) return
  this.web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))   
  this.ipfs.id( (err, res) => {
    if(err){
      swal({   
            title: "Error!",   
            text: 'IPFS Client Not Found',   
            type: "error",   
            confirmButtonText: "Close" 
      });
      console.log('Error while getting OWN ID:',err)
    } else if(res.ID){
      console.log('IPFS ID: ',res.ID)
      this.id = res.ID
      //this can probably be replaced with 'ipfs files stat /' for all local queries to own database 
      this.resolveIPNS(res.ID)
      console.log('Market version is',this.version)
    }
  })
}

MarketAPI.prototype.getEventEmitter = function(){
  return this.ee
}

MarketAPI.prototype.getUsers = function(){
  return Object.keys(this.users)
}

MarketAPI.prototype.getMyID = function(){
  return this.id
}

MarketAPI.prototype.getMarkets = function(){
  this.ipfs.cat(this.idhash+this.baseurl+'markets.json',(err2,res) => {
    if(err2){
      this.ee.emit('error',err2)
      //done(err2,null)
    } else {
      // TODO: JSON parse error handling
      this.marketsList = JSON.parse(res)
      this.ee.emit('market',undefined)
      this.ee.removeEvent('market')
      //done(null,p)
    }
  })
  return this.marketsList
}

MarketAPI.prototype.createUser = function(){
  console.log('Registering a new user with IPFS ID ' + this.id)
  console.log('Checking to see if user is already registered')
  this.isUserProfile(this.id,(isit,err) => {
    //this was getting pulled from temp storage
    //else if(this.users[n] != url) this.isUserProfile(url,(isit,err) => {
    if(isit){
      console.log(this.id,' has an account already')
    } else {
      //do async waterfall and setup the files api for the new user. 
    }
  })
}

MarketAPI.prototype.addPersona = function(persona, done){
  console.log('Creating new persona')
  try {
    var profile_str = JSON.stringify(persona)
  } catch (e) {
    console.log('Error, invalid persona data:', e)
    return done(e)
  }

  asyncjs.waterfall([
    // Create required directories
    // Might do this in the account creation process and hope that it doesn't get lost, could need checks here
    cb => this.ipfs.files.mkdir('/netid-account/personas', { p: true }, cb),
    (e, cb) => {
      // Remove old profile files if present
      var path = '/netid-account/personas/personaSchema.json'
      console.log('removing path ' +path)
      this.ipfs.files.rm(path, { r: true }, (err, res) => {
        if (err) 
          cb(err)
        console.log('removed old personaSchema json file...')
        cb()
      })
    },
    (cb) => {
      // Serialize profile and add to IPFS
      this.ipfs.add(new Buffer(profile_str), cb)
    },
    (res, cb) => {
      // Move profile into mfs
      console.log('added profile to IPFS:', res.Hash)
      var profilepath = '/ipfs/' + res.Hash
      this.ipfs.files.cp([profilepath, '/netid-account/personas/personaSchema.json'], cb)
    },
    (e, cb) => this.ipfs.files.stat('/', cb),
    (res, cb) => {
      var profile_hash = res.Hash
      console.log('Publishing profile...')
      this.ipfs.name.publish(profile_hash, cb)
    }
  ], done)
}

//web3 api endpoints
MarketAPI.prototype.getBalance = function(){
  var coinbase = this.web3.eth.coinbase;
  var originalBalance = this.web3.fromWei(this.web3.eth.getBalance(coinbase).toNumber());
  console.log('Ethereum coinbase: '+this.web3.eth.coinbase)
  return originalBalance
}

MarketAPI.prototype.createContract = function(){
  var self = this
  var interactionsContract =  this.setEthereumAbi("interactions");
  interactionsContract.new(
   {
     from: web3.eth.accounts[1], 
     data: '60606040526040516020806111e4833981016040528080519060200190919050505b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060006007600050819055506000600860026101000a81548160ff021916908302179055506000600860046101000a81548160ff021916908302179055506000600860036101000a81548160ff021916908302179055505b50611132806100b26000396000f360606040523615610124576000357c0100000000000000000000000000000000000000000000000000000000900480630695c46c146101265780630cf6bc25146101495780631027b20c1461016c5780631dcc50a11461017b57806325efc91d1461019e5780633d29a3d2146101d75780634052342f146101e65780635199bdad1461020957806357372bde146102845780635a95cf49146102a75780635c39fcc1146102ca5780636ac5610314610303578063763125e71461033c57806398dae0561461035f578063b8ace704146103da578063c19d93fb146103fd578063cfe1c36814610420578063d3a17ff71461042f578063d59dfd611461043e578063e15fe02314610456578063e7ee6ad6146104f3578063f240f7c31461050b57610124565b005b610133600480505061070f565b6040518082815260200191505060405180910390f35b61015660048050506106ce565b6040518082815260200191505060405180910390f35b6101796004805050610cc1565b005b61018860048050506106fc565b6040518082815260200191505060405180910390f35b6101ab6004805050610540565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101e46004805050610cfb565b005b6101f360048050506106d7565b6040518082815260200191505060405180910390f35b610216600480505061062d565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102765780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6102916004805050610735565b6040518082815260200191505060405180910390f35b6102b460048050506106e0565b6040518082815260200191505060405180910390f35b6102d7600480505061051a565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103106004805050610566565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103496004805050610722565b6040518082815260200191505060405180910390f35b61036c600480505061058c565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156103cc5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6103e760048050506106e9565b6040518082815260200191505060405180910390f35b61040a6004805050610748565b6040518082815260200191505060405180910390f35b61042d6004805050610837565b005b61043c600480505061078a565b005b610454600480803590602001909190505061075b565b005b6104f16004808035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610fb5565b005b610509600480803590602001909190505061089c565b005b6105186004805050610adf565b005b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60036000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106255780601f106105fa57610100808354040283529160200191610625565b820191906000526020600020905b81548152906001019060200180831161060857829003601f168201915b505050505081565b60046000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106c65780601f1061069b576101008083540402835291602001916106c6565b820191906000526020600020905b8154815290600101906020018083116106a957829003601f168201915b505050505081565b60056000505481565b60066000505481565b60076000505481565b600860009054906101000a900460ff1681565b600860019054906101000a900460ff1681565b600860029054906101000a900460ff1681565b600860039054906101000a900460ff1681565b600860049054906101000a900460ff1681565b600860059054906101000a900460ff1681565b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480156107f757506004600860059054906101000a900460ff1614155b15610834576000600860059054906101000a900460ff1614151561081a57610002565b6004600860056101000a81548160ff021916908302179055505b5b565b6000600860059054906101000a900460ff1614151561085557610002565b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506001600860056101000a81548160ff021916908302179055505b565b6001600860059054906101000a900460ff1614806108c957506003600860059054906101000a900460ff16145b15610adb57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614801561093a57506000600860039054906101000a900460ff16145b156109aa578060066000508190555060076000818150548092919060010191905055506001600860036101000a81548160ff021916908302179055507f0540fa278650f67fc26de31c71a48dfbe81fe56faee14fe4cbdd0bcaff4a19c460405180905060405180910390a1610a83565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148015610a1657506000600860049054906101000a900460ff16145b15610a82578060056000508190555060076000818150548092919060010191905055506001600860046101000a81548160ff021916908302179055507f782a86b721c42e647e7e64fe05350a7f29c29c88f86d91c96c59a90b538e960460405180905060405180910390a15b5b60026007600050541415610ada576002600860056101000a81548160ff021916908302179055507f3334f981b1ef3ca0d5af488cedfeded3864fe04265c5108e331c4c1462e348d460405180905060405180910390a15b5b5b50565b600060006002600860059054906101000a900460ff16141515610b0157610002565b6001600860029054906101000a900460ff161415610b1e57610002565b33600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506003600860056101000a81548160ff021916908302179055506001600860026101000a81548160ff021916908302179055507f62e6201d9d8347c868b82a92d7fbfb40d6ec959b06b155dd3a486b2fdc7e9cfe60405180905060405180910390a160405180807f736574546f46696e616c28290000000000000000000000000000000000000000815260200150600c01905060405180910390207c010000000000000000000000000000000000000000000000000000000080910402915061168043019050600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166301991313308484604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182815260200193505050506000604051808303816000876161da5a03f192505050505b5050565b6003600860059054906101000a900460ff16141515610cdf57610002565b6004600860056101000a81548160ff021916908302179055505b565b6002600860059054906101000a900460ff161480610d2857506003600860059054906101000a900460ff16145b15610fb257600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610d9d576001600860006101000a81548160ff021916908302179055505b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610e0d576001600860016101000a81548160ff021916908302179055505b600860019054906101000a900460ff168015610e355750600860009054906101000a900460ff165b15610ebd57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff7f1e393d8f648e647a6dfadc3679e705971550b75e5c722b193a5bae02151894c160405180905060405180910390a16004600860056101000a81548160ff021916908302179055505b6003600860059054906101000a900460ff16148015610f295750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15610fb157600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff7f1e393d8f648e647a6dfadc3679e705971550b75e5c722b193a5bae02151894c160405180905060405180910390a16004600860056101000a81548160ff021916908302179055505b5b5b565b6004600860059054906101000a900460ff16141515610fd357610002565b8160036000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061102257805160ff1916838001178555611053565b82800160010185558215611053579182015b82811115611052578251826000505591602001919060010190611034565b5b50905061107e9190611060565b8082111561107a5760008181506000905550600101611060565b5090565b50508060046000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106110cf57805160ff1916838001178555611100565b82800160010185558215611100579182015b828111156110ff5782518260005055916020019190600101906110e1565b5b50905061112b919061110d565b80821115611127576000818150600090555060010161110d565b5090565b50505b505056', 
     gas: 1500000
   }, function(e, contract){
    console.log(e, contract);
    if (typeof contract.address != 'undefined') {
        console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
        //this.contractAddress = contract.address
        console.log('address: '+contract.address)
        self.saveContract(contract.address)
    }
  })
  //this.saveContract('test')
}

MarketAPI.prototype.saveContract = function(addr){
  var self = this
  console.log('Saving new contract address to IPFS '+addr)
  self.ee.emit('contract',undefined)
  self.ee.removeEvent('contract')
}

MarketAPI.prototype.getProductStatus = function(addr){
  //do web3 connects and check the status of each contract
  //var t = "\'"+addr+"\'"
  //console.log(addr)
  var interactionsContract = this.setEthereumAbi("interactions"); 
  try{
    var interactions = interactionsContract.at(addr)
    var st = interactions.state()
    //console.log('This is the state '+interactions.state())
    return st
  }catch(err) {
    console.log(err)
  }
}

MarketAPI.prototype.updateIntStatus = function (address, status) {
  var intContAbi = this.setEthereumAbi("interactions");
  var intCont = intContAbi.at(address);
  if(status == 0)
    intCont.confirmInvite({from: web3.eth.accounts[0], gas: 100000});
  else
    console.log("contract status is not defined: MarketAPI.protptype.updateIntStatus()");
}

//Central Place to get ABI for ethereum (keep adding new switches for each new ethereum contract abi)
MarketAPI.prototype.setEthereumAbi = function (contractName){
  switch(contractName){
    case "interactions" : 
      var interactionsContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"disputed","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"initiatorRating","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"setToFinal","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"responderConf","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"responder","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[],"name":"confirmRating","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"responderRating","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"dataHash2","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"respRated","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"rateCount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"initiator","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"disputer","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"initRated","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"dataHash1","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"initiatorConf","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[],"name":"confirmInvite","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"cancelInvite","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"init","type":"address"}],"name":"setInitiator","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"firstPart","type":"string"},{"name":"secondPart","type":"string"}],"name":"setHash","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"rating","type":"uint256"}],"name":"rate","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"dispute","outputs":[],"type":"function"},{"inputs":[{"name":"init","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[],"name":"InteractionConfirmed","type":"event"},{"anonymous":false,"inputs":[],"name":"InitRated","type":"event"},{"anonymous":false,"inputs":[],"name":"RespRated","type":"event"},{"anonymous":false,"inputs":[],"name":"Rated","type":"event"},{"anonymous":false,"inputs":[],"name":"Disputed","type":"event"},{"anonymous":false,"inputs":[],"name":"Confirmed","type":"event"}]);
  
      return interactionsContract;
      
    default: console.log("No Ethereum ABI found for contract " + contractName);
  }
}

module.exports = MarketAPI