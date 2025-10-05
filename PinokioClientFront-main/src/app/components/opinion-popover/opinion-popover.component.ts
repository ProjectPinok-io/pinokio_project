import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PopoverModule } from 'primeng/popover';

interface TrustReview {
  description: string;
}

@Component({
  selector: 'app-opinion-popover',
  imports: [PopoverModule, ButtonModule, InputTextModule, ReactiveFormsModule, MessageModule],
  templateUrl: './opinion-popover.component.html',
  styleUrl: './opinion-popover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionPopoverComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  readonly trustForm = this.formBuilder.group({
    description: ['', [Validators.required]],
  });

  isInvalid(controlName: string): boolean {
    const control = this.trustForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  onSubmit(): void {
    if (!this.trustForm.valid) {
      this.trustForm.markAllAsTouched();
      console.error('Form is invalid.');
      return;
    }

    const review: TrustReview = this.trustForm.getRawValue();
    this.trustForm.reset();
    console.log('Review submitted:', review);
  }
}
