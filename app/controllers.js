/* 
 LIRC Web Admin - a web admin for LIRC administration 

 You may use any Web Server Admin project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
 
 */

 (function() {

angular.module('app.controllers', ["app.services","ui-iconpicker"])

    .controller('DebugCtrl', function($scope, $timeout, IRRecord) {

      var statusTextareaElement = document.getElementById("statusTextarea");
      var updateTextareaScroll = function() {
        $timeout(function() {
          statusTextareaElement.scrollTop = statusTextareaElement.scrollHeight;        
        }, 10);
      }

      $scope.getStatus = false;

      $scope.IRRecord = {
        status: "",

        launch: function() {
          IRRecord.launch().then(function(response) {
            $scope.IRRecord.status = response;
            $scope.getStatus = true;
            $scope.IRRecord.getStatus();            
          })
        },

        getNamespace: function() {
          IRRecord.getNamespace().then(function(response) {
            $scope.namespace = response;
          })
        },

        getRemotes: function() {
          IRRecord.getRemotes({raw: true}).then(function(response) {
            $scope.IRRecord.status  = response;
          })
        },

        mode2: function() {
          IRRecord.mode2().then(function(response) {
            $scope.IRRecord.status = response;
            $scope.getStatus = true;
            $scope.testing = true;
            $scope.IRRecord.getStatus();
          })
        },

        enter: function() {
          IRRecord.enter().then(function(response) {
            $scope.IRRecord.status = $scope.IRRecord.status + response;
          })
        },

        stop: function() {
          $scope.getStatus = false;
          $scope.testing = false;
          IRRecord.stop().then(function(response) {
            // Do nothing
          })
        },

        startLirc: function() {
          IRRecord.startLircService().then(function(response) {
            $scope.IRRecord.status += response;
          })
        },

        stopLirc: function() {
          IRRecord.stopLircService().then(function(response) {
            $scope.IRRecord.status += response;
          })
        },

        sendNamespace: function() {
          IRRecord.sendNamespace($scope.selectedNamespace).then(function(response) {
            $scope.IRRecord.status = $scope.IRRecord.status + response;
          })
        },

        getLastConfig: function() {
          IRRecord.getLastConfig().then(function(response) {
            $scope.IRRecord.status = response;
          })
        },

        getStatus: function() {
          IRRecord.getStatus().then(function(response) {
            $scope.IRRecord.status = $scope.IRRecord.status + response;
            updateTextareaScroll();                
            if ($scope.getStatus === true) {
               $timeout($scope.IRRecord.getStatus, 500);
            }
          })
        },

      }

    })

    .controller('WizardCtrl', function($scope, $timeout, IRRecord) {

      $scope.step = 0;
      $scope.pointCount = 0;     
      $scope.status = "";

      $scope.startWizard = function() {
        $scope.loading = true;
        IRRecord.stopLircService().then(function() {
          IRRecord.launch().then(function(response) {
            IRRecord.enter();
             $scope.loading = false;
             $scope.step = 1;
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
        IRRecord.getStatus().then(function(response) {
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
        IRRecord.enter().then(function(response) {
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
        IRRecord.enter().then(function(response) {
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
        IRRecord.getNamespace().then(function(response) {
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

        IRRecord.sendNamespace($scope.selectedNamespace).then(function(response) {
          
        })
      }

      $scope.end = function() {
        $scope.step = 4;
        $scope.loading = true;
        $scope.keepGettingStatus = false;
        IRRecord.enter().then(function() {
          IRRecord.getLastConfig().then(function(response) {
            $scope.config = response;
            $scope.loading = false;
          })
        })
      }

      $scope.save = function() {
        $scope.loading = true;
        IRRecord.saveLastConfig($scope.name).then(function() {
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

    .controller('AdminCtrl', function($scope, IRRecord) {
      var remotes;
      IRRecord.getRemotes().then(function(response) {
        config_remotes = response;
        IRRecord.getUIConfig().then(function(ui_remotes) {
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
      })

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

      $scope.saveRemote = function() {
        var i;
        $scope.loading = true;
        for (i = 0; i < $scope.remotes.length; i++) {
          if ($scope.remotes[i].name === $scope.remote.name) {
            $scope.remotes[i] = $scope.remote;
          }
        }
        IRRecord.saveUIConfig(angular.toJson($scope.remotes)).then(function() {
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
        IRRecord.saveUIConfig(angular.toJson($scope.remotes)).then(function() {
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
        IRRecord.saveUIConfig(angular.toJson($scope.remotes)).then(function() {
          $scope.loading = false;
        });        
      }

    })



}())
