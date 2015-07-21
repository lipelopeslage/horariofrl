;(function(root, $, undefined){

	root.myApp = {
		init : function(){
			var _this = this, url, previousConnectionState = "";
			_this.localJSONURL = "app/res/horarios.json";//"https://api.myjson.com/bins/2rrhz";
			_this.onlineJSONURL = "http://www.lipelopeslage.com.br/fatec/horarios.json";

			_this.textUnfav = "Deseja remover este curso, ciclo e semestre como favorito?";
			_this.textFav = "Deseja adicionar este curso, ciclo e semestre como favorito?<br>Caso escolha, este abrirá automaticamente na próxima vez que iniciar o aplicativo";
 
			//url = (window.navigator.onLine) ? _this.onlineJSONURL : _this.localJSONURL;
			_this.favorito = (localStorage && localStorage.favorito) ? JSON.parse(localStorage.favorito) : null;
			
			
			if(intel.xdk.device.connection != "none"){ // se tiver conexão, verifica cache e equipara com json local
				_this.doOnlineThing(); 
			}else{ // se não tiver conexão, verifica cache e então carrega json local, caso não haja cache
				_this.doOfflineThing();
			}
			_this.view.init();

			/*var txt = "<span style='font-size:11px;'>";
			for(var i in window.device){
				txt += i+":"+window.device[i]+"<br>";
			}
			txt+="</span>"
			$("h1").append(txt)*/

			var previousConnectionState = "";
			document.addEventListener("intel.xdk.device.connection.update",function(e){
				if (previousConnectionState != intel.xdk.device.connection)
		        {
		                previousConnectionState = intel.xdk.device.connection;
		                //alert('mudou status de rede pra:\n'+previousConnectionState);
		        }
		        setTimeout("intel.xdk.device.updateConnection();",2000);
		          //after we get an update on the connection, check again 2 seconds later
			},false);

			setTimeout("intel.xdk.device.updateConnection();",2000);


			document.addEventListener("intel.xdk.device.resume",function(e){
			    //alert('voltou ao aplicativo')
			},false);
		},
		doOnlineThing : function(){
			var _this = this, url = this.onlineJSONURL;
			if(!this.hasCache()){
				$.get(url, function(json){
					//alert("data loaded, should bind")
					localStorage.setItem("json", JSON.stringify(json));
					_this.json = json;
					_this.view.bind();
				});	
			}else{
				//alert('useCache')
				this.useCache();
				this.checkVersions();
			}
		},
		doOfflineThing : function(){
			var _this = this, url = this.localJSONURL;
			if(!this.hasCache()){
				$.get(url, function(json){
					localStorage.setItem("json", JSON.stringify(json));
					_this.json = JSON.parse(json); // o json local precisa ser parseado
					_this.view.bind();
				}).fail(function(e){

					alert('error buscando arquivo');
				});
			}else{
				_this.useCache();
			}
		},
		checkVersions : function(){
			var _this = this, url = this.onlineJSONURL, localJSON = JSON.parse(localStorage.json);
			_this.showWarning("Buscando atualizações...", "success", "search-update");
			$.get(url, function(newJSON){
				_this.hideWarning("search-update");
				if(localJSON.versionID == newJSON.versionID){
					_this.showWarning("Sua versão já está atualizada =)", "success", "search-update");
					_this.json = localJSON;
				}else{
					_this.showWarning("Houveram mudanças nos horários, não se preocupe, seu aplicativo já está atualizado =)", "success", "search-update");
					_this.json = newJSON;
					localStorage.setItem("json", JSON.stringify(newJSON));
				}
				setTimeout(function(){
					_this.hideWarning("search-update");
				}, 2000);
				_this.view.bind();
			});	
		},
		useCache : function(){
			this.json = JSON.parse(localStorage.json);
			//console.log("ja tem no local storage");
			this.view.bind();
		},
		hasCache : function(){
			return Boolean(localStorage.json);
		},
		showWarning : function(msg, klass, id){
			$("body").prepend("<div id='"+id+"' class='alert alert-"+klass+"'>"+msg+"</div>");
			//console.log('warning: ', msg);
		},
		hideWarning : function(id){
			$("body").find(".alert#"+id).remove();
		}
	}
	//window.app.initEvents();
})(window, jQuery)