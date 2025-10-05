import { Component, computed, effect, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { SelectModule } from 'primeng/select';

export interface FilterOptions {
  sortBy: string;
  showVerifiedOnly: boolean;
  contentTypes: string[];
}

@Component({
  selector: 'app-post-filter',
  standalone: true,
  imports: [ReactiveFormsModule, SelectModule, ButtonModule, ChipModule],
  templateUrl: './post-filter.component.html',
  styleUrls: ['./post-filter.component.scss'],
})
export class PostFilterComponent {
  @Output() filterChange = new EventEmitter<FilterOptions>();

  readonly searchQuery = signal('');
  readonly sortOptions = signal<
    {
      label: string;
      value: string;
      icon: string;
    }[]
  >([
    { label: ' Najnowsze', value: 'recent', icon: 'pi pi-clock' },
    { label: ' Najczęściej lubiane', value: 'likes', icon: 'pi pi-heart' },
    { label: ' Najczęściej udostępniane', value: 'retweets', icon: 'pi pi-refresh' },
    { label: ' Najwięcej odpowiedzi', value: 'replies', icon: 'pi pi-comment' },
  ]);
  readonly showVerifiedOnly = signal(false);
  readonly contentTypes = signal<string[]>([]);

  readonly filteredSortOptions = computed(() => {
    if (!this.searchQuery()) return this.sortOptions();

    return this.sortOptions().filter((opt) =>
      opt.label.toLowerCase().includes(this.searchQuery().toLowerCase()),
    );
  });

  readonly sortControl = new FormControl(this.sortOptions()[0], { nonNullable: true });

  ngOnInit() {
    this.sortControl.valueChanges.subscribe(() => {
      this.emitFilters();
    });
  }

  emitFilters() {
    this.filterChange.emit({
      sortBy: this.sortControl.value?.value ?? 'recent',
      showVerifiedOnly: this.showVerifiedOnly(),
      contentTypes: this.contentTypes(),
    });
  }

  toggleVerifiedFilter() {
    this.showVerifiedOnly.update((value) => !value);
    this.emitFilters();
  }

  toggleContentType(value: string) {
    this.contentTypes.update((types) => {
      if (types.includes(value)) {
        return types.filter((v) => v !== value);
      } else {
        return [...types, value];
      }
    });
    this.emitFilters();
  }

  clearAllFilters() {
    this.showVerifiedOnly.set(false);
    this.contentTypes.set([]);
    this.sortControl.setValue(this.sortOptions()[0]);
    this.emitFilters();
  }
}
