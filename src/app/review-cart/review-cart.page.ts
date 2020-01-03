import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as moment from 'moment';
import { uuid } from 'uuidv4';
@Component({
  selector: 'app-review-cart',
  templateUrl: './review-cart.page.html',
  styleUrls: ['./review-cart.page.scss'],
})
export class ReviewCartPage implements OnInit {
  packageName: any;
  startDate: string;
  endDate: string;
  packages: Array<any> = [];
  quantity: any;
  price: any;
  gstNumber: string = ''
  constructor(public modalctrl: ModalController, public navParams: NavParams) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    let data = this.navParams.data
    this.packageName = data.packageName;
    this.price = data.packagePrice;
    this.startDate = moment(data.startDate).format('YYYY-MM-DD');
    this.endDate = moment(data.endDate).format('YYYY-MM-DD')
    let filPackages = data.filteredPackages;
    this.packages.splice(0)
    Object.keys(filPackages).map(x => {
      let b = ""
      filPackages[x].map(y => {

        if (b) b = b + ',' + y.item
        else b = y.item
      })
      let ab = {}
      ab[x] = b
      ab['key'] = x
      this.packages.push(ab)
    })
    this.quantity = data.quantity
    console.log('in ion view ', data)
  }

  dismiss() {
    this.modalctrl.dismiss();
  }

  pay() {
    console.log('in pay');
    let self = this;
    let data = this.navParams.data;
    let selectedPackage = data.cater.Packages.filter(x => x.packageid == data.packageId);

    let paramsObj = data.params;
    let c = []
    paramsObj.data.map(x => {
      let b = ''
      Object.keys(x).map(y => {
        if (y != 'deliverydate') {
          if (b) b = b + ',' + x[y]
          else b = x[y]
        }
      })
      let ab = {}
      ab['menuid'] = uuid();
      ab['deliveryDate'] = x['deliverydate'];
      ab['packagePrice'] = self.price / data.quantity;
      ab['vegnonveg'] = selectedPackage[0].vegnonveg;
      ab['status'] = 'InProgress';
      ab['ismodified'] = "";
      ab['modifiedDate'] = ''
      ab['selectedmenus'] = b
      c.push(ab)
    })
    console.log('cccccccccc', c)

    let params = {};
    params['orderno'] = uuid();
    params['orderedby'] = localStorage.getItem('customerId');
    params['customername'] = localStorage.getItem('customername');
    params['customercontactno'] = localStorage.getItem('customerPhno');
    params['deliveryaddress'] = [];
    params['orderstatus'] = 'booked';
    params['ordertotal'] = this.price + 0.18 * this.price;
    params['voucher'] = '';
    params['kitchenuserId'] = '';
    params['discount'] = 0;
    params['kitchenuserphone'] = '';
    params['SpecialInstructions'] = [];
    params['packageDetail'] = [{
      'packageType': selectedPackage[0].vegnonveg,
      'packageid': data.packageId,
      'selectedpackageitems': c
    }],
      params['KitchenId'] = data.cater._id;
    params['KitcehnName'] = data.cater.CatererName;
    params['PaymentMode'] = 'Online';
    params['OrderMode'] = 'Delivery';
    params['startDate'] = this.startDate;
    params['endDate'] = this.endDate;
    params['serveQuantity'] = data.quantity;
    console.log('paramssss', params)
  }

}
