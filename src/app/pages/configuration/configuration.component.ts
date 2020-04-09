import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { Host } from '../../config/host';
import { UsersService } from 'src/app/services/users/users.service';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { Company } from 'src/app/interfaces/company.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.sass']
})
export class ConfigurationComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  @ViewChild('txtCompanyName') txtCompanyName: ElementRef;
  @ViewChild('txtTotalAdmin') txtTotalAdmin: ElementRef;
  @ViewChild('txtTotalUsers') txtTotalUsers: ElementRef;
  @ViewChild('txtNormalUsers') txtNormalUsers: ElementRef;
  @ViewChild('txtPaymentType') txtPaymentType: ElementRef;
  @ViewChild('paymentFrequency') paymentFrequency: ElementRef;
  @ViewChild('txtPaymentValue') txtPaymentValue: ElementRef;
  @ViewChild('txtPayValue') txtPayValue: ElementRef;

  
  monthly: boolean= true;
  company: Company = null;
  valueToPay: number = 0.00;

  constructor(private invoiceService: InvoicesService, private comapnyService: CompaniesService,   private router: Router,    private usersService: UsersService) { }
  ngOnInit(): void { 
    this.comapnyService.getCompany().subscribe((data)=>{
      this.company = data
      this.txtCompanyName.nativeElement.value = this.company.name
      if(this.company.paymentType===null){
        this.configPayPal()
      }else{
        if(this.company.paymentType==='bank'){
          this.txtPaymentType.nativeElement.value = 'Depósito bancario'
        }
        else if (this.company.paymentType==='paypal'){
          this.txtPaymentType.nativeElement.value = 'PayPal'
        }
        else if (this.company.paymentType==='cash'){
          this.txtPaymentType.nativeElement.value = 'Otro'
        }
        else {
          this.txtPaymentType.nativeElement.value = 'Otro'
        }
      if(this.company.paymentFrequency==='monthly'){
        this.paymentFrequency.nativeElement.value = 'Mensual'
        this.usersService.getTotalUsers().subscribe((data)=>{
          this.txtPaymentValue.nativeElement.value = '$' + ( data.count * 4.99).toString()

        })
      }
      else if (this.company.paymentFrequency==='annually'){
        this.paymentFrequency.nativeElement.value = 'Anual'
        this.usersService.getTotalUsers().subscribe((data)=>{
          this.txtPaymentValue.nativeElement.value = '$' + (data.count * 54.99).toString()
        })
      }
    }
    })
    this.usersService.getTotalOfAdmins().subscribe((data)=>{
      this.txtTotalAdmin.nativeElement.value = data.count
    })
    this.usersService.getTotalOfNormalUsers().subscribe((data)=>{
      this.txtNormalUsers.nativeElement.value = data.count
    })
    this.usersService.getTotalUsers().subscribe((data)=>{
      this.txtTotalUsers.nativeElement.value = data.count
    })

  }

  configPayPal(){
    this.usersService.getTotalUsers().subscribe((data)=>{
      this.txtTotalUsers.nativeElement.value = data.count
      let paypal_plan_id = null
      if(this.monthly){
        this.valueToPay = data.count * 4.99
        this.txtPayValue.nativeElement.value = '$' + this.valueToPay.toString()
        paypal_plan_id = 'P-6FE24885LN492872LL2FZ2II'
      }else{
        this.valueToPay =  data.count * 54.99
        this.txtPayValue.nativeElement.value = '$' + this.valueToPay.toString()
        paypal_plan_id = 'P-3XD2879489470205BL2FZ24Y'
      }
    this.payPalConfig = {
      currency: 'USD',
      vault: "true",
      clientId: 'AQul9ggIGwwsJeY4v32YJlBTCbVNGkKh6zcA6z7u4mp-52etzeAN3rWX7dVit4DBLq39pkhmUcyetCcy',
      createSubscription: (data, actions) => {
        return actions.subscription.create({
          plan_id: paypal_plan_id,
          quantity: this.txtTotalUsers.nativeElement.value
        })
      },
      advanced: {
          commit: 'true'
      },
      style: {
          label: 'paypal',
          layout: 'vertical'
      },
      onApprove: (data, actions) => {
          //console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get().then(details => {
              // console.log('onApprove - you can get full order details inside onApprove: ', details);
              if(this.monthly){
              this.company.paymentFrequency = 'monthly'
            }else{
              this.company.paymentFrequency = 'annually'
            }
            this.company.paymentType = 'paypal'
            this.company.billing = true
              this.comapnyService.updateCompany(this.company).subscribe(data=>{
                this.invoiceService.createInvoice({ paymentType:this.company.paymentType,
                                                    paymentFrequency: this.company.paymentFrequency ,
                                                    value: this.valueToPay ,
                                                    detail: details}).subscribe(data=>{
                                                      location.reload();
                                                    })
              })
          });
      },
      onCancel: (data, actions) => {
          // console.log('OnCancel', data, actions);
      },
      onError: err => {
          console.log('OnError', err);
      },
      onClick: (data, actions) => {
        //  console.log('onClick', data, actions);
      }
  };
  })

  }
  changeToAnnually(){
    this.monthly = false
    this.configPayPal()
  }
  changeToMonthly(){
    this.monthly = true
    this.configPayPal()
  }
}

