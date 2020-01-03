import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-package',
  templateUrl: './package.page.html',
  styleUrls: ['./package.page.scss'],
})

export class PackagePage implements OnInit {
  packages: Array<any> = [];
  packageNames: Array<any> = [];
  caterData: any;
  caterers: Array<any> = [];
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    slidesPerView: 3
  };
  constructor(public http: HttpClient, public router: Router, public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    let self = this;
    this.http.get('http://142.93.219.123:3000/caterers/').subscribe((resp: any) => {
      self.caterers = resp.allCaterers;
      console.log('repppp', resp, 'cateree', self.caterers)
      self.getPackageDetails(self.caterers[0]._id)
    })
  }

  slideChanged(slider) {
    let self = this;
    let id: string = ''
    slider.getActiveIndex().then(res => {
      console.log('resssssss', res)
      id = self.caterers[res]._id;
      console.log('idddd', id)
      self.getPackageDetails(id)
    })

  }


  getPackageDetails(id) {
    let self = this;
    this.http.get('http://142.93.219.123:3000/catererpackages/' + id).subscribe((res: any) => {
      self.caterData = res;
      self.packages = res.selectedCaterer[0].Packages;
      console.log('resss', res)
    })
  }

  navigate(packageName) {
    this.openHome(packageName)
  }

  async openHome(packageDetails) {
    let self = this;
    let modal = await this.modalCtrl.create({
      component: HomePage,
      componentProps: { package: packageDetails.packageid, data: self.caterData }
    })
    modal.present()
  }

}
