import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapitulosService } from '../services/capitulos.service';
import { MatSnackBar, MatBottomSheet } from '@angular/material';
import { ConfigComponent } from '../modals/modal';
import * as $ from 'jquery';
import { Subscription } from '../../../node_modules/rxjs';
import {
    trigger,
    transition,
    style,
    animate,
    state
} from '@angular/animations';
@Component({
	selector: 'app-leer',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './leer.component.html',
	styleUrls: ['./leer.component.css'],
	animations: [trigger('popOverState', [
        state('show', style({
          opacity: 1,
          transform: 'scale(1, 1)'
        })),
        state('hide',   style({
          opacity: 0,
          display: 'none',
          transform: 'scale(.9, .9)'
        })),
        transition('show => hide', animate('100ms ease-out')),
        transition('hide => show', animate('250ms ease-in'))
    ])]
})
export class LeerComponent implements OnInit, OnDestroy {
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
	public pageId: string;
	public url: string = this.router.url || window.location.href;
	private valConfigwidth:number = 100;
	public bbDis: boolean = true;
	private subs: Subscription;
	private count: number = 0;
	public isChapterLoaded: boolean = false;
	public isAllLoaded: boolean = false;
	public numberPage: number = 0;
	public nb = {
		next: false,
		before: true
	}
	public chp = {
		next: true,
		previus: true
	}
	next(): void{
		if(this.numberPage < (this.nObjetos.length - 1)){
			this.numberPage++;
			this.nb.before = false;
		}else this.makeSnack("Capítulo terminado.");
		if(this.numberPage + 1 == this.nObjetos.length)
			this.nb.next = true;
	}
	before(): void{
		if(this.numberPage >= 1){
			this.numberPage--;
			this.nb.next = false;
		}
		if(this.numberPage == 0)
			this.nb.before = true;
	}
	check(): void{
		if(localStorage.getItem('pagemode')){
			let d = localStorage.getItem('pagemode');
			if(d === "true") this.checked = true;
			else this.checked = false;
		} else this.checked = false;
	}
	makeSnack(str: string, t?: number): void{
		this.snack.open(str, null, { duration: t || 1500 });
	}
	ngOnDestroy(): void{
		this.subs.unsubscribe();
	}
	refreshImage(i: number): void{
		this.makeSnack("Actualizando imagen...");
		this.capitulos.getImages(this.chapterInfo.info.directorio, i).then(img => {
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
					this.makeSnack("Imagen actualizada.");
				}catch(ex){}
			}, 1);
		});
	}
	ngOnInit() {
		$("body, html").on('contextmenu', function(){
			return false;
		});
		this.check();
		this.subs = this.route.params.subscribe(subs => {
			this.isChapterLoaded = false;
			this.isAllLoaded = false;
			this.count = 0;
			this.id = this.toDecimal(subs['id']);
			this.pageId = "/leer/" + this.id;
			this.bbDis = true;
			this.nObjetos = [];
			this.capitulos.infoLectura(this.id).then(r => {
				try{
					this.chapterInfo = r;
					if(r.siguiente)
						this.chp.next = false;
					if(r.anterior)
						this.chp.previus = false;
					$("title").text(r.info.nombre + " " + r.info.capitulo + " en BMANGA");
					if(r.info) this.isAllLoaded = true;
					this.bbDis = false;
					this.capitulos.getImagesCount(r.info.directorio).then(c => {
						if(c.error){
							this.loadError = true;
							this.isChapterLoaded = true;
							this.bbDis = true;
							return;
						}
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
										this.count++;
										if(this.count == c.count)
											this.isChapterLoaded = true;
									}catch(ex){}
								}, 1);
								if(localStorage.getItem('vwi')){
									this.valConfigwidth = +localStorage.getItem('vwi');
									$(".view").css({
										'width': this.valConfigwidth + "%"
									});
								}
							}).catch(e => {
								this.loadError = true;
								this.isChapterLoaded = true;
								this.bbDis = true;
							});
						}
					});
				}catch(ex){
					this.loadError = true;
					this.isChapterLoaded = true;
					this.bbDis = true;
				}
			}).catch(() => {
				this.loadError = true;
				this.isChapterLoaded = true;
				this.bbDis = true;
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
		ConfigComponent._close = () => {
			this.sheet.dismiss();
		}
		ConfigComponent._val = (g) => {
			this.valConfigwidth = g;
			localStorage.setItem("vwi", this.valConfigwidth.toString());
		}
		ConfigComponent.setVal(this.valConfigwidth);
		this.sheet.open(ConfigComponent);
	}
	nextChapter(): void{
		if(this.chapterInfo){
			if(this.chapterInfo.siguiente){
				let id = this.chapterInfo.siguiente.id;
				id = id.toString(16);
				this.router.navigate(['/leer', id]);
			} else this.chp.next = true;
		}
	}
	previusChapter(): void{
		if(this.chapterInfo){
			if(this.chapterInfo.anterior){
				let id = this.chapterInfo.anterior.id;
				id = id.toString(16);
				this.router.navigate(['/leer', id]);
			} else this.chp.previus = true;
		}
	}
}