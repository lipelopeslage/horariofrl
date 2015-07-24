;(function(root, $, undefined){
	root.view = {
		init : function(){
			var _this = this, win = $(window), h2Top;
			_this.modal = $("#modal-fav");
			_this.modalBtn = _this.modal.find("button.btn-primary");
			_this.modalBtn.click(function(){return _this.modalAction();});
			
			$("body").fadeIn(100);
			$("main").css("min-height", (win.height() - 150)+"px");

			this.bind();
			if(root.favorito) _this.openFavorite(); 

			win.scroll(function(){
				var top = win.scrollTop(), h2 = $(".tab-pane.active h2"), h2Top = h2.parent().offset().top;
				if(top > h2Top){
					if(!h2.hasClass('fixed'))
						h2.addClass('fixed').parent().css('padding-top', h2.outerHeight()+'px');
				}else{
					if(h2.hasClass('fixed'))
						h2.removeClass('fixed').parent().css('padding-top','0px');
				}
			});
		},
		bind : function (){
			var _this = this;
			$(".nav-tabs").removeClass("blocked").find("li a").click(function(){
				var curso = $(this).attr("aria-controls");
				_this.loadTemplate(curso);
			});			
		},
		loadTemplate : function(id){
			var _this = this, periodosCurso = myApp.json.cursos[id], semestres = [], dias_semana = [],
				nomeCurso = periodosCurso[0].nome, html = "", htmlTemplate, defaultPanel, panel, count = 0;

			htmlTemplate = $("body .tab-content .tab-pane#"+id);

			if(htmlTemplate.html().trim() != "") return;
			
			htmlTemplate.load("app/html/template_horarios.html", function(){
				htmlTemplate.prepend("<h2>"+nomeCurso+"</h2>");
				defaultPanel = htmlTemplate.find(".panel.panel-default:eq(0)");
				defaultPanel.remove();
				html += nomeCurso;
				for(x in periodosCurso){
					periodoCurso = periodosCurso[x];
					
					for(y in periodoCurso.semestres){

						semestreCurso = periodoCurso.semestres[y];
						panel = defaultPanel.clone();
						semanaCurso = semestreCurso.dias_semana;
						_this.fillPanel(panel, semestreCurso, nomeCurso, periodoCurso.periodo, count++);
						htmlTemplate.append(panel);
					}					
				}
				$(".panel-heading .fav").click(function(){
					var target = $(this), curso = target.parent().parent().parent().attr("id"), 
						semestre = target.parent().attr("id"), unfav = false;

					if(root.favorito != null && root.favorito.curso == curso && root.favorito.semestre == semestre){
						unfav = true;
						_this.changeFavModal(root.textUnfav);
					}else{
						_this.changeFavModal(root.textFav);
					}

					_this.modal.attr({
						'data-curso' : curso,
						'data-semestre' : semestre,
						'data-unfav' : unfav
					});

					_this.modal.modal();
					
				});
			});
		},
		fillPanel : function(panel, semestre, nomeCurso, periodo, count){
			var title = panel.find(".panel-title a"), body = panel.find(".panel-body"),
				dias_semana = semestre.dias_semana, html = "", index = String(nomeCurso+periodo+semestre.legenda.replace(/(º )/ ,"")).replace(/ /g,"");//String("_"+count);
			
			if(count == 0){
				//title.attr("aria-expanded", "true");	
				//panel.find(".panel-collapse").addClass("in");
			}

			title.attr("href","#"+index).attr("aria-controls", index);
			panel.find(".panel-heading").attr("id", "heading"+index);
			panel.find(".panel-collapse").attr("aria-labelledby", "heading"+index).attr("id",index);

			html += horarios("Segunda", dias_semana["segunda"]);
			html += horarios("Terça", dias_semana["terca"]);
			html += horarios("Quarta", dias_semana["quarta"]);
			html += horarios("Quinta", dias_semana["quinta"]);
			html += horarios("Sexta", dias_semana["sexta"]);
			html += horarios("Sábado", dias_semana["sabado"]);
			title.html(semestre.legenda+" ("+periodo+")");
			body.html(html);

			function horarios(text, dias_semana){
				var html = "<table class='table'><thead><tr><th>"+text+"</th></tr></thead><tbody>";
				for(dia in dias_semana){
					html += "<tr><td>"+dias_semana[dia].horario+" - "+dias_semana[dia].materia+" ("+dias_semana[dia].professor+")</td></tr>";
				}
				html += "</tbody></table>";
				return html;
			}

		}, 
		fillCredits : function(){
			var creditos = myApp.json.creditos, htmls = "", credito, nome, link;
			for(i in creditos){
				console.log(creditos[i])
				item = creditos[i];
				nome = item.nome;
				url = '"'+item.url+'"';
				link = (item.url) ? "<a onclick='intel.xdk.device.launchExternal("+url+")' >"+nome+"</a>" : nome;
				htmls += item.credito+link+"<br>";
			}
			$("footer").html(htmls);
		},
		openFavorite : function(){
			var _this = this, fav = root.favorito, curso = fav.curso, semestre = fav.semestre;
			$(".panel-collapse").css("transition", "none");
			$(".nav.nav-tabs li a[aria-controls="+curso+"]").trigger("click");

			function scrollToFavorite(){
				var semestreBtn = $("#"+root.favorito.semestre);
				$("html,body").animate({"scrollTop":(semestreBtn.offset().top-$(".tab-pane.active h2").outerHeight())+"px"}, function(){
					$(".panel-collapse").css("transition", "all .4s ease-in-out");
				})
			}

			setTimeout(function(){
				$(".tab-content .tab-pane#"+curso+" .panel-heading#"+semestre+" a").trigger("click").
				parent().siblings('.fav').addClass('selected');
				setTimeout(scrollToFavorite, 300);
			},300);		
		},
		modalAction : function(){
			var modal = this.modal, curso = modal.attr('data-curso'), semestre = modal.attr('data-semestre'), 
				unfav = modal.attr('data-unfav') == 'true', semestreBtn = $("#"+semestre).find("a"),
				semestreBtnOld, favIcon = semestreBtn.parent().siblings('.fav');			

			$(".tab-content .fav").removeClass('selected');

			if(unfav){
				favIcon.removeClass('selected');
				localStorage.removeItem("favorito");
				root.favorito = null;
			}else{
				favIcon.addClass('selected');
				localStorage.setItem("favorito", JSON.stringify({"curso":curso,"semestre":semestre}));
				root.favorito = JSON.parse(localStorage.favorito);
			}
			
			modal.modal('hide');
		},
		changeFavModal : function(text){
			this.modal.find(".modal-body .text-center").html(text);
		}
	}
})(window.myApp, jQuery)