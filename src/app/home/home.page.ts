import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ReviewCartPage } from '../review-cart/review-cart.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  quantity: number = 0;
  caterData: any;
  packages: any = {};
  packageNames: Array<any> = [];
  isExpanded: boolean = false;
  expandedItems: any = {};
  dishesFg: FormGroup = new FormGroup({ 'dishCheck': new FormControl() });
  menus: any;
  submitDisable: boolean = true;
  startTime: any;
  endTime: any;
  packagePrice: any = 0;
  packageCountcheck: any = {};
  pageheader: any = '';

  constructor(public http: HttpClient, public navParams: NavParams, public modalCtrl: ModalController, public alert: AlertController) { }

  ionViewDidEnter() {
    let self = this;
    let data = this.navParams.data;
    console.log('dataa', data)
    self.caterData = data.data.KitchenPackages[0];
    let selectedPackage = self.caterData.Packages.filter(x => x.packageid == data.package);
    self.pageheader = selectedPackage[0].packagename;
    let menus = (selectedPackage[0].standardmenuoptions && selectedPackage[0].standardmenuoptions.filter(x => x.quantity > 0)) || [];
    self.menus = menus;
    let menuItems: Array<any> = [];
    menus.map(x => {
      menuItems.push(x.categoryname)
      self.packageCountcheck[x.categoryname] = x.quantity
    })
    let packages: Array<any> = [];
    self.caterData.Menus.map(x => {
      packages.push(x.menucategory)
      if (menuItems.includes(x.menucategory)) {
        if (!self.packages[x.menucategory]) self.packages[x.menucategory] = []
        self.packages[x.menucategory].push({ item: x.menuname, check: false, menudescription: x.menudescription })
      };
    });
    self.packageNames = Object.keys(self.packages)
    self.packageNames.map(x => {
      self.expandedItems[x] = true
    })
    console.log('menusss', self.menus, 'pacjkagesss', self.packages)
  }

  decrementCount() {
    if (this.quantity) this.quantity--
  }

  incrementCount() {
    this.quantity++
  }

  expand(name) {
    this.isExpanded = !this.isExpanded
    this.expandedItems[name] = !this.expandedItems[name]
  }

  valChanged(pname, item, evt) {
    item.check = evt.checked;
    let self = this;
    let counter = 0
    let quantityCheck: any;
    let filteredMenus = this.menus.filter(x => x.categoryname == pname)
    quantityCheck = filteredMenus[0].quantity;
    this.packages[pname].map(x => {
      if (x.check) {
        counter++
      }
    })
    if (counter == 0) {
      this.submitDisable = true
    }
    if (counter > quantityCheck) {
      let alertData: any = {}
      alertData.header = 'Max ' + quantityCheck + ' item(s)';
      alertData.message = pname + ' can have only ' + quantityCheck + ' item(s)'
      self.openAlert(alertData)
      item.check = false
      evt.checked = false
    }
    else {
      this.submitDisable = false;
    }
  }

  submitDetails() {
    let self = this;
    let paramsObj = {};
    paramsObj['data'] = []
    let diffDays = moment(this.endTime).diff(moment(this.startTime), 'days');
    console.log('diffdatsss', diffDays);
    let dates: Array<any> = [];
    for (let i = 0; i <= diffDays; i++) {
      let a = moment(this.startTime).add(i, 'days').format('DD-MM-YYYY');
      dates.push(a)
    }
    let filPackages: any = {};
    Object.keys(this.packages).map(x => {
      let a = self.packages[x].filter(y => y.check)
      filPackages[x] = a;
    })
    console.log('filpackaaa', filPackages)
    let checkArray = Object.keys(filPackages).filter(x => filPackages[x].length < self.packageCountcheck[x])

    console.log('checkk', checkArray)
    if (checkArray.length == 0) {
      let packageItems = Object.keys(filPackages);
      let elseObj = {}
      packageItems.map(item => elseObj[item] = -1)
      dates.map((x, idx) => {
        let obj = {};
        let i = idx;
        obj['deliverydate'] = x;
        // obj['quantity'] = self.quantity;
        packageItems.map(itemCat => {
          if (filPackages[itemCat][i]) {
            obj[itemCat] = filPackages[itemCat][i].item
          } else {
            elseObj[itemCat] = elseObj[itemCat] + 1
            if (elseObj[itemCat] >= filPackages[itemCat].length) elseObj[itemCat] = 0;
            let val = idx / (filPackages[itemCat].length)
            let index = idx - val * (filPackages[itemCat].length) + elseObj[itemCat];
            obj[itemCat] = filPackages[itemCat][index].item
          }
        })
        paramsObj['data'].push(obj);
      });
      self.openModal(paramsObj, filPackages);
      console.log('paramssObj', paramsObj)
    }
    else {
      let alertData: any = {};
      alertData.header = checkArray[0];
      alertData.message = 'Please select any ' + self.packageCountcheck[checkArray[0]] + ' item(s)';
      self.openAlert(alertData)
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  async openAlert(res) {

    let alert = await this.alert.create({
      header: res.header,
      message: res.message,
      buttons: [{
        text: 'Ok'
      }]
    })
    alert.present()

  }
  quantityChanged() {
    let self = this;
    let data = self.navParams.data
    let selectedPackage = self.caterData.Packages.filter(x => x.packageid == data.package);
    let price: any;
    if (selectedPackage[0].offerprice != 0) {
      price = selectedPackage[0].offerprice
    } else {
      price = selectedPackage[0].menuprice;
    }
    self.packagePrice = (this.quantity || 0) * price;
  }
  getQuantity(pname) {
    let a = this.menus.filter(x => x.categoryname == pname)
    return a[0].quantity;
  }
  async openModal(paramsObj, filPackages) {
    let self = this;
    let data = this.navParams.data
    let modal = await this.modalCtrl.create({
      component: ReviewCartPage,
      componentProps: {
        params: paramsObj, startDate: self.startTime, endDate: self.endTime, quantity: self.quantity,
        packageName: self.pageheader, filteredPackages: filPackages, packagePrice: self.packagePrice, cater: self.caterData, packageId: data.package
      }
    })
    modal.present()
  }
  getTmrw() {
    return moment().add(1, 'days').format('YYYY-MM-DD')
  }

  getDiableCheck() {
    if (this.submitDisable || !this.startTime || !this.endTime || this.quantity == 0 || this.startTime > this.endTime) {
      return true
    }
    else {
      return false
    }
  }

}

