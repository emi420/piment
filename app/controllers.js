/* 
 LIRC Web Admin - a web admin for LIRC administration 

 You may use any Web Server Admin project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
 
 */

 (function() {

angular.module('app.controllers', ["app.services","ui-iconpicker"])

    .controller('DebugCtrl', function($scope, $timeout, IR) {

      var statusTextareaElement = document.getElementById("statusTextarea");
      var updateTextareaScroll = function() {
        $timeout(function() {
          statusTextareaElement.scrollTop = statusTextareaElement.scrollHeight;        
        }, 10);
      }

      $scope.getStatus = false;

      $scope.IR = {
        status: "",
        config: "",

        launch: function() {
          IR.launch().then(function(response) {
            $scope.IR.status = response;
            $scope.getStatus = true;
            $scope.IR.getStatus();            
          })
        },

        getNamespace: function() {
          IR.getNamespace().then(function(response) {
            $scope.namespace = response;
          })
        },

        getRemotes: function() {
          IR.getRemotes({raw: true}).then(function(response) {
            $scope.IR.status  = response;
          })
        },

        mode2: function() {
          IR.mode2().then(function(response) {
            $scope.IR.status = response;
            $scope.getStatus = true;
            $scope.testing = true;
            $scope.IR.getStatus();
          })
        },

        enter: function() {
          IR.enter().then(function(response) {
            $scope.IR.status = $scope.IR.status + response;
          })
        },

        stop: function() {
          $scope.getStatus = false;
          $scope.testing = false;
          IR.stop().then(function(response) {
            // Do nothing
          })
        },

        startLirc: function() {
          IR.startLircService().then(function(response) {
            $scope.IR.status += response;
          })
        },

        stopLirc: function() {
          IR.stopLircService().then(function(response) {
            $scope.IR.status += response;
          })
        },

        sendNamespace: function() {
          IR.sendNamespace($scope.selectedNamespace).then(function(response) {
            $scope.IR.status = $scope.IR.status + response;
          })
        },

        getLastConfig: function() {
          IR.getLastConfig().then(function(response) {
            $scope.IR.status = response;
          })
        },

        getConfig: function() {
          IR.getConfig().then(function(response) {
            $scope.IR.config = response;
          })
        },

        saveConfig: function() {
          IR.saveConfig($scope.IR.config).then(function(response) {
            $scope.IR.status = response;
          })
        },

        getStatus: function() {
          IR.getStatus().then(function(response) {
            $scope.IR.status = $scope.IR.status + response;
            updateTextareaScroll();                
            if ($scope.getStatus === true) {
               $timeout($scope.IR.getStatus, 500);
            }
          })
        },

      }

    })

    .controller('WizardCtrl', function($scope, $timeout, IR) {

      $scope.step = 0;
      $scope.pointCount = 0;     
      $scope.status = "";

      $scope.startWizard = function() {
        $scope.loading = true;
        IR.stopLircService().then(function() {
          IR.stop().then(function() {
            IR.launch().then(function(response) {
              IR.enter();
               $scope.loading = false;
               $scope.recordingMsg = false;
               $scope.step = 1;
            })          
          })          
        });
      }
      $scope.showStatus = false;
      $scope.showOrHideStatus = function() {
        if ($scope.showStatus === true) {
          $scope.showStatus = false;
        } else {
          $scope.showStatus = true;
        }
      }

      $scope.getNumber = function(num) {
        return new Array(num);   
      }

      var getStatus = function() {
        IR.getStatus().then(function(response) {
          if (response !== "[EOF]" && response !== "Error." && response !== "Try again.") {
            $scope.status = $scope.status + response;
            if (response.length < 10) {
              $scope.pointCount += response.split(".").length;
            } else if ($scope.step < 3 && response.indexOf("Please enter the name for the next button") > -1) {
              $scope.step3();
            } else if ($scope.step == 2 && response.indexOf("Please press an arbitrary button repeatedly as fast as possible") > -1) {
              $scope.step2B();
            } else if ($scope.step == 3 && response.indexOf("ENTER") > -1) {
                $scope.recordingMsg = false;
                $scope.recordMsg = true;
                $timeout.cancel(timeout3);
                $timeout(function() {
                  $scope.recordMsg = false;
                }, 1000);
            }
            if ($scope.keepGettingStatus === true) {
               $timeout(getStatus, 500);
            }
          } else {
            $scope.step = 'error';
            $scope.keepGettingStatus = false;
          }
        })
      }

      $scope.errorOk = function() { 
        $scope.discard()
      }
      var timeout1;
      $scope.step2 = function() {
        $scope.loading = true;
        IR.enter().then(function(response) {
           timeout1 = $timeout(function() {
            if ($scope.step === 2) {
              $scope.timeout = true;
            }
           }, 60000)
           $scope.step = 2;
           $scope.keepGettingStatus = true;
           getStatus();
          $scope.loading = false;
        })        
      }

      $scope.step2B = function() {
        $timeout.cancel(timeout1);
        $scope.pointCount = 0;
        $scope.step = 2.1;
      }

      var timeout2;
      $scope.step2C = function() {
        $scope.loading = true;
        IR.enter().then(function(response) {
           timeout2 = $timeout(function() {
            if ($scope.step === 2.2) {
              $scope.timeout = true;
            }
           }, 60000)
           $scope.step = 2.2;
           $scope.keepGettingStatus = true;
           getStatus();
          $scope.loading = false;
        }) 
      }


      $scope.step3 = function() {
        $scope.step = 3;
        $scope.loading = true;
        $scope.recordingMsg = false;
        $timeout.cancel(timeout1);
        $timeout.cancel(timeout2);
        IR.getNamespace().then(function(response) {
           $scope.namespace = response;
           $scope.loading = false;
        })        

      }
      var timeout3;
      $scope.recordButton = function() {
        $scope.recordingMsg = true;
        $timeout.cancel(timeout3);
         timeout3 = $timeout(function() {
          if ($scope.step === 3) {
            $scope.recordingMsg = false;
          }
         }, 30000)

        IR.sendNamespace($scope.selectedNamespace).then(function(response) {
          
        })
      }

      $scope.end = function() {
        $scope.step = 4;
        $scope.loading = true;
        $scope.keepGettingStatus = false;
        IR.enter().then(function() {
          IR.getLastConfig().then(function(response) {
            $scope.config = response;
            IR.stop().then(function() {
              IR.startLircService().then(function() {
                $scope.loading = false;
              })
            })
          })
        })
      }

      $scope.save = function() {
        $scope.loading = true;
        IR.saveLastConfig($scope.name).then(function() {
          $scope.saved = true;
          $timeout(function() {
            $scope.saved = false;
            $scope.step = 0;
            $scope.loading = false;
          }, 2000);
        })
      }

      $scope.discard = function() {
        $scope.status = "";
        $scope.pointCount = 0;
        $scope.step = 0;
        $scope.loading = false;
        $timeout.cancel(timeout1);
        $timeout.cancel(timeout2);
      }
    })

    .controller('Wizard2Ctrl', function($scope, $timeout, IR) {

      $scope.step = 0;
      $scope.pointCount = 0;     
      $scope.status = "";

      $scope.step2 = function() {
        $scope.loading = true;
        $scope.recordingMsg = false;
        IR.stopLircService().then(function() {
          IR.stop().then(function() {
            IR.getNamespace().then(function(response) {
               $scope.namespace = response;
               $scope.step = 2;
               $scope.loading = false;
            })        
          })        
        });
      }
      $scope.showStatus = false;
      $scope.showOrHideStatus = function() {
        if ($scope.showStatus === true) {
          $scope.showStatus = false;
        } else {
          $scope.showStatus = true;
        }
      }


      $scope.step1 = function() {
        $scope.step = 1;
      }

      $scope.recordedButtons = {};

      var recordStep = 0;
      var buttonSignal = "";

      var getStatus = function() {
        IR.getStatus().then(function(response) {
          console.log("\n" + response)
          $scope.status = $scope.status + response;
          if (response !== "[EOF]" && response !== "Error." && response !== "Try again.") {
            if ($scope.step === 2) {
              buttonSignal += response;
              if (recordStep === 0 && response !== "") {                
                  recordStep = 1;
              } else if (recordStep === 1 && response === "") {                
                  recordStep = 2;
                  $scope.keepGettingStatus = false;
                  $scope.recordedButtons[$scope.selectedNamespace.replace("\r","")] = buttonSignal.split("\n").slice(1).join("     ").replace(/\r/g, "").replace(/pulse/g, "").replace(/space/g, "");
                  buttonSignal = "";
                  IR.stop().then(function(response) {
                    $scope.recordingMsg = false;
                  });
              }
            }
            if ($scope.keepGettingStatus === true) {
               $timeout(getStatus, 500);
            }
          } else {
            $scope.step = 'error';
            $scope.keepGettingStatus = false;
          }
        })
      }

      $scope.errorOk = function() { 
        $scope.discard()
      }

      $scope.step3 = function() {
        var indexBegin, indexEnd, key, config;
        indexBegin = $scope.configTemplate.indexOf("begin raw_codes") + 15;
        indexEnd = $scope.configTemplate.indexOf("      end raw_codes");
        config = $scope.configTemplate.substring(0, indexBegin);
        for (key in $scope.recordedButtons) {
          config += "\n\n";
          config += "          name " + key + "\n";
          config += "            " + $scope.recordedButtons[key];
        }
        config += "\n\n";
        config += $scope.configTemplate.substring(indexEnd, $scope.configTemplate.length);
        $scope.config = config;
        $scope.step = 3;
      }

      $scope.recordButton = function() {
        IR.mode2().then(function(response) {
          console.log("mode2")
          $scope.keepGettingStatus = true;
          $scope.recordingMsg = true;
          recordStep = 0;
          getStatus();
        })
      }

      $scope.save = function() {
        $scope.loading = true;
        $scope.config  = $scope.config.replace(/tmplircd.conf/g, $scope.name) 

        IR.getConfig().then(function(currentConfig) {
          IR.saveConfig(currentConfig + $scope.config).then(function() {
              IR.stop().then(function() {
                IR.startLircService().then(function() {
                  $scope.saved = true;
                  $timeout(function() {
                    $scope.saved = false;
                    $scope.step = 0;
                    $scope.loading = false;
                  }, 2000);
                })
              })
          })
        })

      }

      $scope.discard = function() {
        $scope.status = "";
        $scope.pointCount = 0;
        $scope.step = 0;
        $scope.loading = false;
      }
    })

    .controller('AdminCtrl', function($scope, IR, Relay, $routeParams) {
      var remotes, Manager;

      if ($routeParams.controltype == "ir") {
        $scope.title = "IR"
        Manager = IR;

        Manager.getRemotes().then(function(response) {
          config_remotes = response;
          Manager.getUIConfig().then(function(ui_remotes) {
            var i,j;
            for (i = 0; i < ui_remotes.length; i++) {
              for (j = 0; j < config_remotes.length; j++) {
                if (config_remotes[j].name === ui_remotes[i].name) {
                  config_remotes[j].uicodes = ui_remotes[i].uicodes;
                  config_remotes[j].published = ui_remotes[i].published;
                }
              }
            }
            $scope.remotes = config_remotes;
          })
        });

      } else {
        Manager = Relay;
        $scope.title = "Relay"

        Manager.getUIConfig().then(function(ui_remotes) {
          $scope.remotes = ui_remotes;
        })

      }

      $scope.editRemote = function(remote) {
        var i, 
          count = 0,
          total;

        if (remote.uicodes) {
          count = remote.uicodes.length;
        } else {
          remote.uicodes = [];
        }
        total = 21 - count;

        for (i = 0; i < total; i++) {
           remote.uicodes.push({
             id: count + i,
             name: "",
             color: "default"
           })
        }
        $scope.selectedRemoteId = remote.id;
        $scope.remote = remote;

      }

      $scope.editBtn = function(code) {
        $scope.code = code;
        $("#editModal").modal('show');            
      }

      $scope.setBtnColor = function(color, code) {
        code.color = color;
      }


      $scope.deleteBtn = function(code) {
        code.color = "default";
        code.icon = "";
        code.name = "";
      }


      $scope.saveRemote = function() {
        var i;
        $scope.loading = true;
        for (i = 0; i < $scope.remotes.length; i++) {
          if ($scope.remotes[i].name === $scope.remote.name) {
            $scope.remotes[i] = $scope.remote;
          }
        }
        Manager.saveUIConfig(angular.toJson($scope.remotes)).then(function() {
          $scope.loading = false;          
        });        
      }

      $scope.disableRemote = function() {
        var i;
        $scope.loading = true;
        for (i = 0; i < $scope.remotes.length; i++) {
          if ($scope.remotes[i].name === $scope.remote.name) {
            $scope.remotes[i].published = false;
          }
        }
        Manager.saveUIConfig(angular.toJson($scope.remotes)).then(function() {
          $scope.loading = false;
        });        
      }

      $scope.enableRemote = function() {
        var i;
        $scope.loading = true;
        for (i = 0; i < $scope.remotes.length; i++) {
          if ($scope.remotes[i].name === $scope.remote.name) {
            $scope.remotes[i].published = true;
          }
        }
        Manager.saveUIConfig(angular.toJson($scope.remotes)).then(function() {
          $scope.loading = false;
        });        
      }

    })

    .controller('RemotesCtrl', function($scope, IR, Relay) {
      Manager = IR;
      Manager.getUIConfig().then(function(ui_remotes) {
        $scope.remotes = ui_remotes;
      })

      $scope.showRemote = function(remote) {
        var i, 
          count = 0,
          total;

        if (remote.uicodes) {
          count = remote.uicodes.length;
        } else {
          remote.uicodes = [];
        }
        total = 21 - count;

        for (i = 0; i < total; i++) {
           remote.uicodes.push({
             id: count + i,
             name: "",
             color: "default"
           })
        }
        $scope.selectedRemoteId = remote.id;
        $scope.remote = remote;

      }

      $scope.sendCommand = function(code) {
         Manager.sendCommand($scope.remote.name,code.name).then(function(response) {
           
         }) 
       }

    })



}())
