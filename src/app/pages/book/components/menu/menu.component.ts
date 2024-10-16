import { Component, inject } from '@angular/core';
import { SettingService } from '../../services/setting-book.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu-book',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuBookComponent {
  currentBreakpoint: number = 1;
  segment: 'content' | 'settings' = 'content';
  settingService = inject(SettingService);
  menuService = inject(MenuService);

  setCurrentBreakpoint(breakpoint: number) {
    const modal = this.settingService.getSettingModal();
    this.currentBreakpoint = breakpoint;
    modal.setCurrentBreakpoint(breakpoint);
  }

  openSearch() {
    this.settingService.settingModal.dismiss();
    this.menuService.open('Search', "search");
  }

}
