import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapitulosService } from '../services/capitulos.service';
import { MatSnackBar, MatBottomSheet } from '@angular/material';
import { ConfigComponent } from '../modals/modal';
import * as $ from 'jquery';
@Component({
	selector: 'app-leer',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './leer.component.html',
	styleUrls: ['./leer.component.css']
})
export class LeerComponent implements OnInit {
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private capitulos: CapitulosService,
		private snack: MatSnackBar,
		private sheet: MatBottomSheet
	) { }
	public checked = false;
	private id: number;
	public loadError: boolean = false;
	public chapterInfo: any;
	public nObjetos: Array<number> = [];
	public pageId: string = "/leer/";
	public url: string = this.router.url;
	check(): void{
		if(localStorage.getItem('pagemode')){
			let d = localStorage.getItem('pagemode');
			if(d === "true") this.checked = true;
			else this.checked = false;
		} else this.checked = false;
	}
	makeSnack(str: string, t: number): void{
		this.snack.open(str, null, { duration: t || 1500 });
	}
	ngOnInit() {
		$("body, html").on('contextmenu', function(){
			return false;
		});
		this.check();
		this.route.params.subscribe(subs => {
			this.id = this.toDecimal(subs['id']);
			this.pageId += this.id;
			this.capitulos.infoLectura(this.id).then(r => {
				try{
					this.chapterInfo = r;
					$("title").text(r.info.nombre + " " + r.info.capitulo + " en BMANGA");
					this.capitulos.getImagesCount(r.info.directorio).then(c => {
						for(let j = 0; j < c.count; j++)
							this.nObjetos.push(j);
						for(let i = 0; i < c.count; i++){
							this.capitulos.getImages(r.info.directorio, i).then(img => {
								setTimeout(() => {
									try{
										let canvas = (<any> document.getElementById('img'+i));
										let ctx = canvas.getContext('2d');
										let noImage = new Image();
										noImage.src = img.image;
										noImage.onload = function(){
											canvas.width = noImage.width;
											canvas.height = noImage.height;
											ctx.drawImage(noImage, 0, 0);
										}
									}catch(ex){}
								}, 1);
							}).catch(e => {
								this.loadError = true;
							});
						}
					});
				}catch(ex){
					this.loadError = true;
				}
			}).catch(() => {
				this.loadError = true;
			});
		});
	}
	pageChangeMode(): void{
		localStorage.setItem('pagemode', this.checked.valueOf().toString());
	}
	toDecimal(hexa: string): number{
		return parseInt(hexa, 16);
	}
	title(str: string): string{
		if(str) return str;
		else return "";
	}
	upto(): void{
		$("body, html").animate({
			scrollTop: 0
		}, "slow");
	}
	openConfig(): void{
		this.sheet.open(ConfigComponent);
	}
}