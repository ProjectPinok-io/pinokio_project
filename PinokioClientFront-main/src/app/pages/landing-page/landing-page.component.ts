import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Post } from '../../models/post.model';
import { PostFilterComponent } from '../../components/post-filter/post-filter.component';
import { OpinionPopoverComponent } from '../../components/opinion-popover/opinion-popover.component';
import { PostAuditComponent } from '../../components/post-audit.component/post-audit.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    OpinionPopoverComponent,
    CardModule,
    PostFilterComponent,
    AvatarModule,
    ButtonModule,
    PostAuditComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  readonly mockPosts = signal<Post[]>([
    {
      id: 1,
      author: {
        name: 'Sarah Johnson',
        username: 'sarahj_dev',
        avatar: 'https://i.pravatar.cc/150?img=1',
        verified: true,
      },
      content:
        'Just deployed my first Angular v20 application! The new features are incredible. Standalone components make everything so much cleaner. 🚀',
      timestamp: new Date(Date.now() - 3600000),
      likes: 234,
      retweets: 45,
      replies: 12,
    },
    {
      id: 2,
      author: {
        name: 'Mike Chen',
        username: 'mikechen_tech',
        avatar: 'https://i.pravatar.cc/150?img=12',
        verified: false,
      },
      content:
        'Hot take: PrimeNG is the best component library for Angular. The customization options are unmatched.',
      timestamp: new Date(Date.now() - 7200000),
      likes: 567,
      retweets: 89,
      replies: 34,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
    },
    {
      id: 3,
      author: {
        name: 'Emma Davis',
        username: 'emmadavis',
        avatar: 'https://i.pravatar.cc/150?img=5',
        verified: true,
      },
      content:
        "Working on a new design system for our Angular app. Clean, modular SCSS is the way to go. Here's what I learned about component architecture...",
      timestamp: new Date(Date.now() - 10800000),
      likes: 892,
      retweets: 156,
      replies: 67,
    },
    {
      id: 4,
      author: {
        name: 'Alex Rodriguez',
        username: 'alex_codes',
        avatar: 'https://i.pravatar.cc/150?img=8',
        verified: false,
      },
      content:
        'Responsive design tip: Always start mobile-first, then enhance for larger screens. Your users will thank you! 📱💻',
      timestamp: new Date(Date.now() - 14400000),
      likes: 445,
      retweets: 78,
      replies: 23,
    },
    {
      id: 5,
      author: {
        name: 'Lisa Wang',
        username: 'lisawang_ux',
        avatar: 'https://i.pravatar.cc/150?img=9',
        verified: true,
      },
      content:
        'The intersection of great UX and clean code is where magic happens. Angular makes this possible with its structured approach.',
      timestamp: new Date(Date.now() - 18000000),
      likes: 1203,
      retweets: 234,
      replies: 89,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
    },
  ]);

  private readonly filterOptions = signal<{
    sortBy: string;
    showVerifiedOnly: boolean;
    contentTypes: string[];
  }>({
    sortBy: 'recent',
    showVerifiedOnly: false,
    contentTypes: [],
  });

  readonly displayedPosts = computed(() => {
    const posts = this.mockPosts();
    const { showVerifiedOnly, sortBy, contentTypes } = this.filterOptions();

    let filtered = this.filterPosts(posts, showVerifiedOnly);
    filtered = this.filterByContentType(filtered, contentTypes);
    return this.sortPosts(filtered, sortBy);
  });

  filterPosts(posts: Post[], showVerifiedOnly: boolean): Post[] {
    if (!showVerifiedOnly) return posts;
    return posts.filter((post) => post.author.verified);
  }

  filterByContentType(posts: Post[], contentTypes: string[]): Post[] {
    if (contentTypes.length === 0) return posts;

    return posts.filter((post) => {
      const hasImage = !!post.image;
      const includesText = contentTypes.includes('text');
      const includesImages = contentTypes.includes('images');
      const includesLinks = contentTypes.includes('links');

      if (includesText && !includesImages && !includesLinks) {
        return !hasImage;
      }
      if (includesImages && !includesText && !includesLinks) {
        return hasImage;
      }

      return true;
    });
  }

  sortPosts(posts: Post[], sortBy: string): Post[] {
    return [...posts].sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes;
        case 'retweets':
          return b.retweets - a.retweets;
        case 'replies':
          return b.replies - a.replies;
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });
  }

  onFilterChange(options: any) {
    this.filterOptions.set({
      sortBy: options.sortBy,
      showVerifiedOnly: options.showVerifiedOnly,
      contentTypes: options.contentTypes,
    });
  }

  formatTimestamp(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);

    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d`;
    }
  }

  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  onLike(post: Post) {
    post.likes++;
  }

  onRetweet(post: Post) {
    post.retweets++;
  }

  onReply(post: Post) {
    console.log('Reply to post:', post.id);
  }
}
