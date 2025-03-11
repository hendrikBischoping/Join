import { Component, Input, input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-help-component',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './help-component.component.html',
  styleUrl: './help-component.component.scss'
})

/**
 * Represents a component that provides help information based on the current route.
 */
export class HelpComponentComponent {
  currentRoute: string = "";

  /**
   * Constructor to initialize the HelpComponentComponent.
   * @param _route - The activated route to access route parameters.
   */
  constructor(private _route: ActivatedRoute) { }

  /**
   * Lifecycle Hook: Called on component initialization.
   * Subscribes to route parameters to get the current help route.
   */
  ngOnInit() {
    this._route.params.subscribe(params => {
      this.currentRoute = params["returnHelp"];
    });
  }
}
