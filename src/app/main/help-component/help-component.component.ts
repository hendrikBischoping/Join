import { Component, Input, input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-help-component',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './help-component.component.html',
  styleUrl: './help-component.component.scss'
})
export class HelpComponentComponent {
  currentRoute: string = "";
constructor (private _route:ActivatedRoute) {
  // console.log(this.returnHelp);
  
}
ngOnInit(){
  this._route.params.subscribe(params => {
    this.currentRoute = params["returnHelp"];
  });
  console.log(this.currentRoute);
  
}
}
