(function(angular) {

    var SETTINGS =  {
      host: "http://"+window.location.hostname
    };

    // Debug setting
    if (SETTINGS.host.indexOf("localhost") > -1) {
      SETTINGS.host = SETTINGS.host.replace("localhost","192.168.0.104")
    }

    angular.module('app.services', [])

    .factory('Settings', function() {
        return SETTINGS;
    })

    .factory('IR', function($q, $http) {
        return {

          launch: function() {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/ir/').then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise;                      
          },

          getNamespace: function() {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/ir/get-namespace/').then(function(r) {
              deferred.resolve( r.data.split("\n"));
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise;                                           
          },

          mode2: function() {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/ir/mode2/').then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise; 
          },

          enter: function() {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/ir/enter/').then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise; 
          },


          stop: function() {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/ir/kill/').then(function(r) {
              deferred.resolve(true);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise; 
          },
          sendCommand: function(controlname, codename) {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/lirc/send/' + [controlname, codename].join(",") ).then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise; 
          },

          sendNamespace: function(namespace) {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/ir/' + namespace + '/send/' ).then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise; 
          },

          getLastConfig: function() {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/ir/get-last-config/' ).then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise; 
          },

          saveLastConfig: function(name) {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/ir/' + name + '/save-last-config/' ).then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise; 
          },

          saveConfig: function(data) {
            var deferred = $q.defer();
            $http.post(SETTINGS.host + '/api/ir/save-config/', data).then(function(r) {
              deferred.resolve("Ok.");
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise; 
          },

          stopLircService: function() {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/ir/stop-lirc-service/' ).then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise; 
          },

          startLircService: function() {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/ir/start-lirc-service/' ).then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise; 
          },

          getStatus: function() {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/ir/status/').then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise;    
          },

          getConfig: function() {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/ir/get-config/').then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise;    
          },

          getUIConfig: function() {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/get-ui-config/').then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise;    
          },

          saveUIConfig: function(data) {
            var deferred = $q.defer();
            $http.post(SETTINGS.host + '/api/ir/save-ui-config/',data).then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise;    
          },

          getRemotes: function(options) {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/ir/get-config/').then(function(r) {
              if (options && options.raw === true) {
                deferred.resolve(r.data);
              } else {
                var lines = r.data.split('\n');
                var remotes = [];
                var remote = {};
                var codes = false;
                var code;
                var raw = false;
                var regexp;
                var codename;

                for(var i = 0;i < lines.length;i++) {

                  if (lines[i].indexOf("begin remote") > -1) {
                    remote = {
                      id: remotes.length
                    }
                  } else if (lines[i].indexOf("end remote") > -1) {
                    remotes.push(remote);
                  } else if (lines[i].indexOf("name ") > -1 && codes === false) {
                    remote.name = lines[i].replace("name", "").replace(/ /g, "")
                  } else if (lines[i].indexOf("begin codes") > -1) {
                    remote.codes = [];
                    codes = true;
                    raw = false;
                  } else if (lines[i].indexOf("begin raw_codes") > -1) {
                    remote.codes = [];
                    codes = true;
                    raw = true;
                  } else if (lines[i].indexOf("end codes") > -1 || lines[i].indexOf("end raw_codes") > -1) {
                    codes = false;
                  } else if (codes === true) {
                    if (raw) {
                      regexp = new RegExp("name (.*)","g")
                    } else {
                      regexp = new RegExp(" {10}(.*) {10}","g")
                    }
                    try {
                      codename = lines[i].match(regexp)
                      if (codename !== null) {
                        code = {
                          name: codename[0].replace("name ","").replace(/\s/g, '')
                        }
                        remote.codes.push(code);   
                      }
                    } catch(e) { 
                      console.log(e)
                    }

                  }
                }   
                deferred.resolve(remotes)             
              }
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise;                                           
          },

        }
    })


    .factory('Relay', function($q, $http) {
        return {

          sendCommand: function(controlname, codename) {
            var deferred = $q.defer();  /api/relay/off/2.1
            $http.get(SETTINGS.host + '/api/relay/' + codename + '/' + controlname ).then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise; 
          },

          getUIConfig: function() {
            var deferred = $q.defer();
            $http.get(SETTINGS.host + '/api/get-relay-ui-config/').then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise;    
          },

          saveUIConfig: function(data) {
            var deferred = $q.defer();
            $http.post(SETTINGS.host + '/api/ir/save-relay-ui-config/',data).then(function(r) {
              deferred.resolve(r.data);
            }, function(r) {
              deferred.resolve("Error.");
            });
            return deferred.promise;    
          },

      }          
  });


}(window.angular));
