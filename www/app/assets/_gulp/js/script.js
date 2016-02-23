;(function(root, $, undefined){

	root.myApp = {
		init : function(){
			var _this = this, url, previousConnectionState = "";

			_this.useCache();
			_this.localJSONURL = "app/res/horarios.min.json";//"https://api.myjson.com/bins/2rrhz";
			_this.onlineJSONURL = (_this.json && _this.json.utils) ? _this.json.utils.jsonURL : "http://www.lipelopeslage.com.br/fatec/horarios.min.json";

			_this.textUnfav = "Deseja remover este curso, ciclo e semestre como favorito?";
			_this.textFav = "Deseja adicionar este curso, ciclo e semestre como favorito?<br>Caso escolha, este abrirá automaticamente na próxima vez que iniciar o aplicativo";
			_this.textUpdate = "Houve mudanças nos horários, confirme para atualizar as listagens agora, ou cancele para atualizá-las na próxima vez que entrar neste aplicativo."
 			//localStorage.removeItem("json");  // só para testes no emulador
			
			_this.favorito = (localStorage && localStorage.favorito) ? JSON.parse(localStorage.favorito) : null;
			
			
			if(navigator.connection.type == "none"){ 
				// se não tiver conexão, verifica cache e então carrega json local, caso não haja cache
				_this.doOfflineThing();
			}else{ 
				// se tiver conexão, verifica cache e equipara com json local
				_this.doOnlineThing();
			}

			document.addEventListener("online", _this.doOnlineThing, false);

			//iniciando

			_this.doOfflineThing();

			_this.view.init();
			
			$(".refresh .btn").click(function(){
				_this.doOnlineThing();
			})
		},
		doOnlineThing : function(){
			var _this = this, url = this.onlineJSONURL;
			if(!this.hasCache()){
				_this.doOfflineThing();
			}else{
				//usa o cache
				this.useCache();
				this.checkVersions();
				//bind da view só acontece após ajax
			}
			
		},
		doOfflineThing : function(){
			var _this = this, url = this.localJSONURL;
			if(!this.hasCache()){
				//nao tem cache, carregando json
				$.get(url+"?t="+Date.now(), function(json){
					//_this.json = json; // --> USE ESSA LINHA NO EMULADOR
					_this.json = JSON.parse(json); // --> USE ESSA LINHA AO COMPILAR PRO DEVICE
					localStorage.setItem("json", JSON.stringify(_this.json));
					_this.view.buildMenu().bind();
					_this.view.fillCredits();

				}).fail(function(e){
					alert('Erro buscando arquivo local. Contate o autor.');
				});
			}else{
				//tem cache
				_this.useCache();
				_this.view.buildMenu().bind();
				_this.view.fillCredits();
			}
		},
		checkVersions : function(){
			var _this = this, url = this.onlineJSONURL, localJSON = JSON.parse(localStorage.json), 
				timeout = 2000, waitingTimeout;

			_this.showWarning("Buscando atualizações...", "success", "search-update");

			$.get(url+"?t="+Date.now(), function(newJSON){
				clearTimeout(waitingTimeout); // limpa tempo de espera
				
				_this.hideWarning("search-update");
				
				if(localJSON.versionID == newJSON.versionID){
					_this.showWarning("Sua versão já está atualizada =)", "success", "search-update");
					_this.json = localJSON;
				}else{
					_this.json = newJSON;
					localStorage.setItem("json", JSON.stringify(newJSON));
					_this.view.updateModal(_this.textUpdate);
				}
				_this.view.fillCredits();
				setTimeout(function(){
					_this.hideWarning("search-update");
				}, timeout);

			}).fail(function(){
				clearTimeout(waitingTimeout); // limpa tempo de espera
				_this.showWarning("Erro de conexão, tente novamente mais tarde", "danger", "search-update");
				setTimeout(function(){
					_this.hideWarning("search-update");
				},5000);
			});

			// EM CASO DE MUITA ESPERA, JOGAR ERRO
			waitingTimeout = setTimeout(function(){
				_this.showWarning("Erro de conexão, tente novamente mais tarde", "danger", "search-update");
				setTimeout(function(){
					_this.hideWarning("search-update");
				},5000);
			}, 6000 * 5); // 5 min. de espera
		},
		useCache : function(){
			this.json = (localStorage && localStorage.json) ? JSON.parse(localStorage.json) : null;
		},
		hasCache : function(){
			return Boolean(localStorage.json);
		},
		showWarning : function(msg, klass, id){
			$("body").find(".alert#"+id).remove();
			$("body").prepend("<div id='"+id+"' class='alert alert-"+klass+"'>"+msg+"</div>");
		},
		hideWarning : function(id){
			$("body").find(".alert#"+id).remove();
		}
	}
	//window.app.initEvents();
})(window, jQuery)