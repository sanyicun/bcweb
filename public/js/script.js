function login(){
	//Get info from forms
	var form = document.getElementById('login2-form');

	var data = {
	    email: form.username.value ,
	    password: form.password.value
  	};
    alert(form.username.value);
    alert(form.password.value);
  	console.log(data);

	//Pass info to route and get token
	fetch('/login', {
	    method: 'POST',
	    headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
		},
	    body: JSON.stringify(data)
  	}).then(function(res) {
    	if (!res.ok) {
    		console.log('error1');
        alert('err1');
    	} 
    	else
    	{
         alert('login success');
        console.log('login success');
			return res.json().then(function(result) {
          setCookie('token', result.token, 2);
          location.href = "/wallet";
     		});

    	}
  	}).catch(function(err){
      alert(err);
    	console.log(err);
  	});
}




function register(){
	var form = document.getElementById('register-form');

	if(form.password.value == form.verify.value){
		var data = {
		    email: form.email.value,
		    password: form.password.value,
    		phone: form.phone.value,
    		first_name: form.firstname.value,
    		last_name: form.lastname.value
		};

		//CORRECT WAY OF DOING FETCH REQUEST
		fetch('/register', {
		    method: 'POST',
		    headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
		    body: JSON.stringify(data)
		}).then(function(res) {
		    if(!res.ok){
		    	console.log('failed to register. Error on backend');
		    }
		    else
		    {
		    	location.href = "/login";
		    }
		}).catch(function(err){
		    console.log("error2")
		});
		

	}
}

function logout(){
	//TODO: purge token from memory
	eraseCookie("token");
}

function sendTransaction(walletID, targetAddress, amount){

	var data = {
		address: targetAddress,
		amount: amount,
		currency: 'BTC'
	};

	fetch('/send/' + walletID, {
	    method: 'POST',
	    headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
		  },
	    body: JSON.stringify(data)
	}).then(function(res) {
	    if(!res.ok) {
	      closeSendModal()
        document.getElementById("failSend").style.display = 'block'
      }
      else {
        closeSendModal()
        document.getElementById("successSend").style.display = 'block'
      };
	}).catch(function(err){
	    console.log("error2")
	});
}

function receive(){
	location.href = "/receive";
	
	var userToken = readCookie('token');
	
	var data = {
		token: userToken
	};

	fetch('/receive', {
	    method: 'POST',
	    body: JSON.stringify(data)
	}).then(function(res) {
	    if(!res.ok) console.log('error1');
	}).catch(function(err){
	    console.log("error2")
	});
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}


function generateWallets() {
	fetch('/walletsBackend', {
	    method: 'GET',
	    headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token': readCookie('token')
		}
  	}).then(function(res) {
    	if (!res.ok) {
    		console.log('error1');
    	} 
    	else
    	{
			return res.json().then(function(result) {
        var walletContainer = '<div class="wallet">'

        var count = 0;

        for (var i = 0; i < result.wallets.length; i++){
          (function(x) {
            var tokenInfo = {
              "token": readCookie('token')
            }
            fetch('/walletAddress/' + result.wallets[i].id, {
              method: 'POST',
              headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'x-access-token': readCookie('token')
              },
              body: JSON.stringify(tokenInfo)
            }).then(function (res) {
              if (!res.ok) {
                console.log('did not correctly receive wallet address given wallet id');
              }
              else {
                return res.json().then(function (data) {
                  walletContainer += '<h1>' + result.wallets[x].balance + ' ' + result.wallets[x].currency + '</h1>' + '<div class="walletButtons">' + '<div id="submit-button" onclick="displaySendModal(\''+data.address+'\')"> Send </div>' + '<div class="receive-button" id="receive-button' + x + '" onclick="displayReceiveModal(\''+ data.address +'\');"> Receive </div>' + '</div>';

                  count++;

                  if (count === result.wallets.length) {
                    walletContainer += '</div>'
                    document.getElementById('listOfWallets').innerHTML = walletContainer
                  }
                })


              }
            });
          }(i))
        }

     		});

    	}
  	});

}

function generateTransactions(walletId) {

  var token = readCookie('token')

	fetch('/transactionsBackend/' + localStorage.walletId , {
	    method: 'GET',
	    headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
        'x-access-token': token
		}
	}).then(function(res) {
    	if (!res.ok) {
    		console.log('error transactions');
    	}
    	else
    	{
			return res.json().then(function(result) {
        var transactionContainer = '<div class="transaction">'

        transactionContainer += '<h1>Incoming Transactions</h1>'
        if (result.incoming_txs.length == 0){
          transactionContainer += '<div class="wallet">'
          transactionContainer += '<h2> No Incoming Transactions </h2>';
          transactionContainer += '</div>'
        }
        else {
          for (var i = 0; i < result.incoming_txs.length; i++){
            transactionContainer += '<div class="wallet">'
            transactionContainer += '<h2> Bought ' + result.incoming_txs[i].unit + ' </h2>';
            transactionContainer += '<h2> Amount: ' + result.incoming_txs[i].amount + '</h2>';
            transactionContainer += '<h2> From: ' + result.incoming_txs[i].from + '</h2>';
            transactionContainer += '</div>'
          }
        }

        transactionContainer += '<h1>Outgoing Transactions</h1>'
        if (result.outgoing_txs.length == 0){
          transactionContainer += '<div class="wallet">'
          transactionContainer += '<h2> No Incoming Transactions </h2>';
          transactionContainer += '</div>'
        }
        else{
          for (var i = 0; i < result.outgoing_txs.length; i++){
            transactionContainer += '<div class="wallet">'
            transactionContainer += '<h2> Bought ' + result.outgoing_txs[i].unit + ' </h2>';
            transactionContainer += '<h2> Amount: ' + result.outgoing_txs[i].amount + '</h2>';
            transactionContainer += '<h2> To: ' + result.outgoing_txs[i].to + '</h2>';
            transactionContainer += '</div>'
          }
        }


        transactionContainer += '</div>'
        document.getElementById('listOfTransactions').innerHTML = transactionContainer;

     		});

    	}
  	});
}

