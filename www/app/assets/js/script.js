!function(e,o){e.myApp={init:function(){var e=this;e.localJSONURL="app/res/horarios.min.json",e.onlineJSONURL="http://www.lipelopeslage.com.br/fatec/horarios.min.json",e.textUnfav="Deseja remover este curso, ciclo e semestre como favorito?",e.textFav="Deseja adicionar este curso, ciclo e semestre como favorito?<br>Caso escolha, este abrirá automaticamente na próxima vez que iniciar o aplicativo",e.favorito=localStorage&&localStorage.favorito?JSON.parse(localStorage.favorito):null,e.doOfflineThing(),e.view.init(),o(".refresh .btn").click(function(){e.doOnlineThing()})},doOnlineThing:function(){var e=this,a=this.onlineJSONURL;this.hasCache()?(this.useCache(),this.checkVersions()):o.get(a,function(o){localStorage.setItem("json",JSON.stringify(o)),e.json=o,e.view.fillCredits()}).fail(function(){alert("Erro buscando arquivo. Contate o autor do app.")})},doOfflineThing:function(){var e=this,a=this.localJSONURL;this.hasCache()?(e.useCache(),e.view.fillCredits()):o.get(a+"?t="+Date.now(),function(o){e.json=JSON.parse(o),localStorage.setItem("json",JSON.stringify(e.json)),e.view.fillCredits()}).fail(function(){alert("Erro buscando arquivo. Contate o administrador.")})},checkVersions:function(){var e=this,a=this.onlineJSONURL,i=JSON.parse(localStorage.json),n=2e3;e.showWarning("Buscando atualizações...","success","search-update"),o.get(a+"?t="+Date.now(),function(o){e.hideWarning("search-update"),i.versionID==o.versionID?(e.showWarning("Sua versão já está atualizada =)","success","search-update"),e.json=i):(n=5e3,e.showWarning("Houve mudanças nos horários, não se preocupe, seu aplicativo já está atualizado =)","success","search-update"),e.json=o,localStorage.setItem("json",JSON.stringify(o)),e.view.reset()),e.view.fillCredits(),setTimeout(function(){e.hideWarning("search-update")},n)}).fail(function(){e.showWarning("Erro na conexão, tente novamente mais tarde","danger","search-update"),setTimeout(function(){e.hideWarning("search-update")},5e3)})},useCache:function(){this.json=localStorage&&localStorage.json?JSON.parse(localStorage.json):null},hasCache:function(){return Boolean(localStorage.json)},showWarning:function(e,a,i){o("body").find(".alert#"+i).remove(),o("body").prepend("<div id='"+i+"' class='alert alert-"+a+"'>"+e+"</div>")},hideWarning:function(e){o("body").find(".alert#"+e).remove()}}}(window,jQuery);