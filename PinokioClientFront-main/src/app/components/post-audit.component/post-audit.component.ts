import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-post-audit',
  standalone: true,
  imports: [CommonModule, TagModule, StyleClassModule],
  templateUrl: './post-audit.component.html',
  styleUrls: ['./post-audit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostAuditComponent {
  readonly auditData = {
    isLegit: signal<boolean>(Math.random() > 0.3), // 70% chance of being legit
    isDisformative: signal<boolean>(Math.random() < 0.2), // 20% chance of being disformative
  };

  auditStatus = computed(() => {
    const isLegit = this.auditData.isLegit();
    const isDisformative = this.auditData.isDisformative();

    if (isLegit && !isDisformative) {
      return 'Zatwierdzone';
    } else if (isLegit && isDisformative) {
      return 'Wątpliwe';
    } else if (!isLegit && isDisformative) {
      return 'Szkodliwe';
    } else {
      return 'Wymaga audytu';
    }
  });

  getSeverity():
    | 'success'
    | 'secondary'
    | 'info'
    | 'warn'
    | 'danger'
    | 'contrast'
    | null
    | undefined {
    const status = this.auditStatus();
    switch (status) {
      case 'Zatwierdzone':
        return 'success';
      case 'Wątpliwe':
      case 'Wymaga audytu':
        return 'warn';
      case 'Szkodliwe':
        return 'danger';
      default:
        return 'warn';
    }
  }

  getCheckIcon(status: boolean): string {
    return status ? 'pi pi-check-circle' : 'pi pi-times-circle';
  }
}
