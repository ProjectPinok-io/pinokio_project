export class BadgeService {
  static valid = (): HTMLDivElement => {
    const wrapper = BadgeService.generateWrapper();
    wrapper.innerHTML = `<i class="ti ti-check"></i>`;

    return wrapper;
  };

  static warning = (): HTMLDivElement => {
    const wrapper = BadgeService.generateWrapper();
    wrapper.innerHTML = `<i class="ti ti-alert-triangle"></i>`;

    return wrapper;
  };

  static error = (): HTMLDivElement => {
    const wrapper = BadgeService.generateWrapper();
    wrapper.innerHTML = `<i class="ti ti-x"></i>`;

    return wrapper;
  };

  private static generateWrapper = (): HTMLDivElement => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('pinokio-badge');

    return wrapper;
  };
}
