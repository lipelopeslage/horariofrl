!function(e,n){e.myApp={init:function(){var e=this;e.useCache(),e.localJSONURL="app/res/horarios.min.json",e.onlineJSONURL=e.json&&e.json.utils?e.json.utils.jsonURL:"http://www.lipelopeslage.com.br/fatec/horarios.min.json",e.textUnfav="Deseja remover este curso, ciclo e semestre como favorito?",e.textFav="Deseja adicionar este curso, ciclo e semestre como favorito?<br>Caso escolha, este abrirá automaticamente na próxima vez que iniciar o aplicativo",e.textUpdate="Houve mudanças nos horários, confirme para atualizar as listagens agora, ou cancele para atualizá-las na próxima vez que entrar neste aplicativo.",e.favorito=localStorage&&localStorage.favorito?JSON.parse(localStorage.favorito):null,"none"==navigator.connection.type?e.doOfflineThing():e.doOnlineThing(),document.addEventListener("online",e.doOnlineThing,!1),e.doOfflineThing(),e.view.init(),n(".refresh .btn").click(function(){e.doOnlineThing()})},doOnlineThing:function(){{var e=this;this.onlineJSONURL}this.hasCache()?(this.useCache(),this.checkVersions()):e.doOfflineThing()},doOfflineThing:function(){var e=this,a=this.localJSONURL;this.hasCache()?(e.useCache(),e.view.buildMenu().bind(),e.view.fillCredits()):n.get(a+"?t="+Date.now(),function(n){e.json=JSON.parse(n),localStorage.setItem("json",JSON.stringify(e.json)),e.view.buildMenu().bind(),e.view.fillCredits()}).fail(function(){alert("Erro buscando arquivo local. Contate o autor.")})},checkVersions:function(){var e,a=this,o=this.onlineJSONURL,i=JSON.parse(localStorage.json),t=2e3;a.showWarning("Buscando atualizações...","success","search-update"),n.get(o+"?t="+Date.now(),function(n){clearTimeout(e),a.hideWarning("search-update"),i.versionID==n.versionID?(a.showWarning("Sua versão já está atualizada =)","success","search-update"),a.json=i):(a.json=n,localStorage.setItem("json",JSON.stringify(n)),a.view.updateModal(a.textUpdate)),a.view.fillCredits(),setTimeout(function(){a.hideWarning("search-update")},t)}).fail(function(){clearTimeout(e),a.showWarning("Erro de conexão, tente novamente mais tarde","danger","search-update"),setTimeout(function(){a.hideWarning("search-update")},5e3)}),e=setTimeout(function(){a.showWarning("Erro de conexão, tente novamente mais tarde","danger","search-update"),setTimeout(function(){a.hideWarning("search-update")},5e3)},3e4)},useCache:function(){this.json=localStorage&&localStorage.json?JSON.parse(localStorage.json):null},hasCache:function(){return Boolean(localStorage.json)},showWarning:function(e,a,o){n("body").find(".alert#"+o).remove(),n("body").prepend("<div id='"+o+"' class='alert alert-"+a+"'>"+e+"</div>")},hideWarning:function(e){n("body").find(".alert#"+e).remove()}}}(window,jQuery);