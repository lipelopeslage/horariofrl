;(function(root, $, undefined){

	root.myApp = {
		init : function(){
			var _this = this, url, previousConnectionState = "";
			_this.localJSONURL = "app/res/horarios.min.json";//"https://api.myjson.com/bins/2rrhz";
			_this.onlineJSONURL = "http://www.lipelopeslage.com.br/fatec/horarios.min.json";

			_this.textUnfav = "Deseja remover este curso, ciclo e semestre como favorito?";
			_this.textFav = "Deseja adicionar este curso, ciclo e semestre como favorito?<br>Caso escolha, este abrirá automaticamente na próxima vez que iniciar o aplicativo";
 
			//url = (window.navigator.onLine) ? _this.onlineJSONURL : _this.localJSONURL;
			_this.favorito = (localStorage && localStorage.favorito) ? JSON.parse(localStorage.favorito) : null;
			
			
			/*if(navigator.connection.type != "Connection.UNKNOWN" || navigator.connection.type != "Connection.NONE"){ // se tiver conexão, verifica cache e equipara com json local
				_this.doOnlineThing();
			}else{ // se não tiver conexão, verifica cache e então carrega json local, caso não haja cache
				_this.doOfflineThing();
			}*/

			//alert("init")

			_this.doOfflineThing();

			_this.view.init();
			
			$(".refresh .btn").click(function(){
				_this.doOnlineThing();
			})
		},
		doOnlineThing : function(){
			var _this = this, url = this.onlineJSONURL;
			if(!this.hasCache()){
				$.get(url, function(json){
					localStorage.setItem("json", JSON.stringify(json));
					_this.json = json;	
					_this.view.fillCredits();
				}).fail(function(){
					alert("Erro buscando arquivo. Contate o autor do app.")
				});	
			}else{
				//alert('useCache')
				this.useCache();
				this.checkVersions();
				//bind da view só acontece após ajax
			}
			
		},
		doOfflineThing : function(){
			var _this = this, url = this.localJSONURL;
			if(!this.hasCache()){
				//alert("nao tem cache, carregando json")
				$.get(url+"?t="+Date.now(), function(json){
				//	alert("json carregado")
					_this.json = JSON.parse(json); // o json local precisa ser parseado
					localStorage.setItem("json", JSON.stringify(_this.json));
					//alert(">>> \n"+JSON.parse(localStorage.json).creditos)
					_this.view.fillCredits();

				}).fail(function(e){
					alert('Erro buscando arquivo. Contate o administrador.');
				});
			}else{
				//alert("tem cache")
				_this.useCache();
				_this.view.fillCredits();
			}
		},
		checkVersions : function(){
			var _this = this, url = this.onlineJSONURL, localJSON = JSON.parse(localStorage.json), timeout = 2000;
			_this.showWarning("Buscando atualizações...", "success", "search-update");
			$.get(url+"?t="+Date.now(), function(newJSON){
				_this.hideWarning("search-update");
				
				if(localJSON.versionID == newJSON.versionID){
					_this.showWarning("Sua versão já está atualizada =)", "success", "search-update");
					_this.json = localJSON;
				}else{
					timeout = 5000;
					_this.showWarning("Houve mudanças nos horários, não se preocupe, seu aplicativo já está atualizado =)", "success", "search-update");
					_this.json = newJSON;
					localStorage.setItem("json", JSON.stringify(newJSON));
					_this.view.reset();
				}
				_this.view.fillCredits();
				setTimeout(function(){
					_this.hideWarning("search-update");
				}, timeout);
			}).fail(function(){
				_this.showWarning("Erro na conexão, tente novamente mais tarde", "danger", "search-update");
				setTimeout(function(){
					_this.hideWarning("search-update");
				},5000);
			});
		},
		useCache : function(){
			this.json = (localStorage && localStorage.json) ? JSON.parse(localStorage.json) : null;
			//alert("1: "+this.json.versionID);
			//alert("2: "+this.json.creditos);
			//alert("3: \n"+this.json);

			//console.log("ja tem no local storage");
		},
		hasCache : function(){
			return Boolean(localStorage.json);
		},
		showWarning : function(msg, klass, id){
			$("body").find(".alert#"+id).remove();
			$("body").prepend("<div id='"+id+"' class='alert alert-"+klass+"'>"+msg+"</div>");
			//console.log('warning: ', msg);
		},
		hideWarning : function(id){
			$("body").find(".alert#"+id).remove();
		}
	}
	//window.app.initEvents();
})(window, jQuery)