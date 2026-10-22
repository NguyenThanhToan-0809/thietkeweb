
// ==========================================================================
// PROMPT 68: HIỆU ỨNG LOADING XOAY TRÒN (PAGE TRANSITION LOADER) & VOUCHER LOGOUT
// ==========================================================================

function showPageLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.classList.add('active');
  }
}

function hidePageLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.classList.remove('active');
  }
}

// Tự động ẩn loader khi trang tải xong và khi khôi phục từ bfcache (Back/Forward)
window.addEventListener('load', hidePageLoader);
window.addEventListener('pageshow', () => {
  hidePageLoader();
});

function initPageLoader() {
  // Ẩn loader khi DOM khởi tạo
  hidePageLoader();

  // Tự động bắt sự kiện click trên các thẻ liên kết chuyển trang (<a>)
  document.addEventListener('click', (e) => {
    // Chỉ xử lý click chuột trái thông thường (không kèm Ctrl, Meta, Shift, Alt)
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      return;
    }

    const link = e.target.closest('a');
    if (!link) return;

    // Bỏ qua nếu sự kiện đã bị chặn trước đó
    if (e.defaultPrevented) return;

    // Bỏ qua file download, mở tab mới (_blank), hoặc class .no-loader
    if (link.hasAttribute('download')) return;
    if (link.getAttribute('target') === '_blank') return;
    if (link.classList.contains('no-loader')) return;

    // Bỏ qua nút toggle tài khoản, chat CSKH, modal triggers
    if (link.id === 'tz-user-btn' || link.classList.contains('tz-user-btn') || link.closest('#tz-user-wrapper') || link.closest('.cskh-chat-popup')) {
      return;
    }

    const hrefAttr = link.getAttribute('href');
    if (!hrefAttr) return;

    const trimmedHref = hrefAttr.trim();
    // Bỏ qua liên kết neo (#), javascript:, tel:, mailto:
    if (trimmedHref === '' || trimmedHref.startsWith('#') || trimmedHref.startsWith('javascript:') || trimmedHref.startsWith('tel:') || trimmedHref.startsWith('mailto:')) {
      return;
    }

    try {
      const targetUrl = new URL(link.href, window.location.origin);

      // Bỏ qua liên kết ra bên ngoài domain
      if (targetUrl.origin !== window.location.origin) {
        return;
      }

      // Bỏ qua chuyển neo trên cùng trang hiện tại
      if (targetUrl.pathname === window.location.pathname && targetUrl.hash && !targetUrl.search) {
        return;
      }

      // Kích hoạt hiệu ứng loading: bật spinner 300ms rồi chuyển hướng mượt sang trang mới
      e.preventDefault();
      showPageLoader();
      setTimeout(() => {
        window.location.href = link.href;
      }, 200);
    } catch (err) {
      // Bỏ qua nếu parse URL thất bại
    }
  }, false);
}

// Xử lý đăng xuất riêng biệt cho trang vouchers.html: Xóa currentUser và chuyển thẳng về index.html
function handleVoucherLogout(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // 1. Xóa currentUser và các khóa liên quan khỏi localStorage
  try {
    if (typeof Auth !== 'undefined' && typeof Auth.logout === 'function') {
      Auth.logout();
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('techzone_current_user');
      localStorage.removeItem('userName');
      localStorage.removeItem('techzone_remember_login');
    }
  } catch (err) {
    localStorage.removeItem('currentUser');
  }

  // 2. Đóng dropdown tài khoản nếu đang mở
  const dropdown = document.getElementById('tz-user-dropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
  }

  // 3. Hiển thị thông báo Toast nếu có
  if (typeof showToast === 'function') {
    showToast('Đã đăng xuất tài khoản thành công!', 'info', 'Đăng xuất');
  }

  // 4. Kích hoạt spinner xoay chuyển trang
  showPageLoader();

  // 5. Chuyển hướng trực tiếp về trang chủ index.html (thay vì đưa ra login.html)
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 300);
}

window.showPageLoader = showPageLoader;
window.hidePageLoader = hidePageLoader;
window.initPageLoader = initPageLoader;
window.handleVoucherLogout = handleVoucherLogout;


// ==========================================================================
// TECHZONE (TZ) UNIFIED CONTROLLER & SAFE STORAGE SYSTEM
// ==========================================================================

const SafeStorage = {
  getItem(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (e) {
      console.warn(`[TechZone SafeStorage] Lỗi khi đọc key "${key}":`, e);
      return fallback;
    }
  },
  getJSON(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      if (!val) return fallback;
      return JSON.parse(val);
    } catch (e) {
      console.warn(`[TechZone SafeStorage] Lỗi khi parse JSON key "${key}":`, e);
      return fallback;
    }
  },
  setItem(key, value) {
    try {
      const str = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, str);
      return true;
    } catch (e) {
      console.warn(`[TechZone SafeStorage] Lỗi khi ghi key "${key}":`, e);
      return false;
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`[TechZone SafeStorage] Lỗi khi xóa key "${key}":`, e);
      return false;
    }
  }
};
window.SafeStorage = SafeStorage;

const TechZone = {
  version: '2.5.0',
  SafeStorage: SafeStorage,

  // 1. Quản lý User: Lấy currentUser an toàn, đồng bộ tên hiển thị trên header mọi trang
  User: {
    get() {
      try {
        if (typeof Auth !== 'undefined' && typeof Auth.getUser === 'function') {
          return Auth.getUser();
        }
        const raw = SafeStorage.getJSON('currentUser') || SafeStorage.getJSON('techzone_current_user');
        return raw || null;
      } catch (e) {
        return null;
      }
    },
    set(user) {
      try {
        if (typeof Auth !== 'undefined' && typeof Auth.setCurrentUser === 'function') {
          Auth.setCurrentUser(user);
        } else {
          SafeStorage.setItem('currentUser', user);
          SafeStorage.setItem('techzone_current_user', user);
        }
      } catch (e) {}
    },
    logout() {
      if (typeof executeLogout === 'function') {
        executeLogout();
      } else if (typeof Auth !== 'undefined' && typeof Auth.logout === 'function') {
        Auth.logout();
      } else {
        SafeStorage.removeItem('currentUser');
        SafeStorage.removeItem('techzone_current_user');
        window.location.href = 'index.html';
      }
    },
    syncHeader() {
      if (typeof initUserAccount === 'function') {
        initUserAccount();
      }
    }
  },

  // 2. Logic Điểm Smember & Hồ sơ: Chỉ tính đơn 'Đã giao' / 'Giao hàng thành công', 1% chi tiêu
  Profile: {
    syncStats(user) {
      if (typeof calculateAndSyncUserStats === 'function') {
        return calculateAndSyncUserStats(user);
      }
      return null;
    },
    init() {
      if (typeof initProfilePage === 'function') {
        initProfilePage();
      }
    }
  },

  // 3. Kho Voucher cá nhân hóa: Lấy voucher thật từ vouchers_${user.email}, đếm isUsed: false, không số ảo
  Vouchers: {
    get(user) {
      if (typeof VoucherService !== 'undefined' && typeof VoucherService.getUserVouchers === 'function') {
        return VoucherService.getUserVouchers(user);
      }
      const currentUser = user || TechZone.User.get();
      if (!currentUser) return [];
      const storageKey = `vouchers_${currentUser.email || currentUser.username || ''}`;
      return SafeStorage.getJSON(storageKey, []);
    },
    add(voucher, user) {
      if (typeof VoucherService !== 'undefined' && typeof VoucherService.addVoucherToUser === 'function') {
        return VoucherService.addVoucherToUser(voucher, user);
      }
      return { success: false, message: 'Dịch vụ voucher chưa sẵn sàng' };
    },
    markUsed(code, user, orderId) {
      if (typeof VoucherService !== 'undefined' && typeof VoucherService.markVoucherAsUsed === 'function') {
        VoucherService.markVoucherAsUsed(code, user, orderId);
      }
    },
    updateBadges() {
      if (typeof updateGlobalVoucherBadges === 'function') {
        updateGlobalVoucherBadges();
      }
    },
    initPage() {
      if (typeof initVouchersPage === 'function') {
        initVouchersPage();
      }
    }
  },

  // 4. Khung Chat CSKH: Giữ kích thước nhỏ gọn 280px x 360px, phản hồi tự động mượt mà
  Support: {
    init() {
      if (typeof initFloatingSupportWidget === 'function') {
        initFloatingSupportWidget();
      }
    },
    open() {
      const popup = document.querySelector('.cskh-chat-popup, .tz-support-chat-box');
      if (popup) popup.classList.add('show');
    },
    close() {
      const popup = document.querySelector('.cskh-chat-popup, .tz-support-chat-box');
      if (popup) popup.classList.remove('show');
    }
  },

  // 5. Chặn Modal Đăng nhập thừa khi đã đăng nhập
  AuthGuard: {
    checkAndBlock() {
      if (typeof guardGoogleLoginModals === 'function') {
        guardGoogleLoginModals();
      }
    }
  },

  // 6. Page Loader xoay tròn
  Loader: {
    show() {
      if (typeof showPageLoader === 'function') showPageLoader();
    },
    hide() {
      if (typeof hidePageLoader === 'function') hidePageLoader();
    },
    init() {
      if (typeof initPageLoader === 'function') initPageLoader();
    }
  },

  // 7. Khởi tạo toàn diện toàn trang
  init() {
    this.Loader.init();
    this.AuthGuard.checkAndBlock();
    this.User.syncHeader();
    this.Vouchers.updateBadges();
    this.Support.init();
  }
};

window.TechZone = TechZone;
window.TZ = TechZone;



/**
 * ==========================================================================
 * TECHZONE ECOSYSTEM - CORE JAVASCRIPT ENGINE (ES6)
 * Tech Catalog, Slider, Flash Sale Timer, LocalStorage, Cart & Tracking
 * ==========================================================================
 */

// --- 1. MOCK DATA: TECHZONE TECH CATALOG (20 SẢN PHẨM LƯU ẢNH CỤC BỘ images/spX.jpg) ---
const allProducts = [
  {
    "id": "sp1",
    "name": "iPhone 16 Pro Max 256GB - Titanium Tự Nhiên",
    "category": "phone",
    "brand": "Apple",
    "originalPrice": 36990000,
    "price": 34490000,
    "oldPrice": 36990000,
    "discountPercent": 7,
    "isInstallment": true,
    "rating": 4.9,
    "reviewCount": 1820,
    "soldCount": "3.2k",
    "totalStock": 100,
    "isFlashSale": true,
    "specs": [
      "6.9\" Super Retina XDR 120Hz",
      "Chip Apple A18 Pro 3nm",
      "Camera Control 48MP Fusion",
      "Khung viền Titanium Grade 5",
      "Pin 33 giờ, sạc MagSafe 25W"
    ],
    "image": "images/sp1.jpg",
    "description": "Flagship đỉnh cao từ Apple với phím điều khiển Camera Control hoàn toàn mới, chip A18 Pro tiến trình 3nm xử lý Apple Intelligence cực nhanh và viền màn hình mỏng nhất lịch sử iPhone.",
    "reviews": [
      {
        "id": "rev_sp1_1",
        "author": "Hoàng Nam",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
        "stars": 5,
        "date": "Hôm qua",
        "variant": "Titan Tự Nhiên, 256GB",
        "comment": "Màu Titan Tự Nhiên bên ngoài đẹp sang trọng vượt kỳ vọng, nút Camera Control bấm chụp rất nhạy. Bưu tá SPX giao 2h đóng gói cẩn thận 3 lớp chống sốc.",
        "likes": 24,
        "verified": true
      },
      {
        "id": "rev_sp1_2",
        "author": "Bích Ngọc",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        "stars": 5,
        "date": "3 ngày trước",
        "variant": "Titan Sa Mạc, 256GB",
        "comment": "Màn hình 6.9 inch cực rộng nhưng viền siêu mỏng nên cầm không bị cấn tay. Pin dùng cả ngày liên tục lướt web và chụp ảnh vẫn còn trên 35%.",
        "likes": 18,
        "verified": true
      },
      {
        "id": "rev_sp1_3",
        "author": "Tuấn Kiệt",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80",
        "stars": 5,
        "date": "1 tuần trước",
        "variant": "Titan Đen, 512GB",
        "comment": "Nâng cấp từ 13 Pro Max lên thấy đáng từng đồng, camera chụp đêm bắt sáng tốt hơn hẳn, loa ngoài to và âm trường rất rộng.",
        "likes": 11,
        "verified": true
      }
    ]
  },
  {
    "id": "sp2",
    "name": "Samsung Galaxy S24 Ultra 12GB 256GB Titanium Gray",
    "category": "phone",
    "brand": "Samsung",
    "originalPrice": 33990000,
    "price": 27990000,
    "oldPrice": 33990000,
    "discountPercent": 18,
    "isInstallment": true,
    "rating": 4.9,
    "reviewCount": 1248,
    "soldCount": "2.4k",
    "totalStock": 100,
    "isFlashSale": true,
    "specs": [
      "Snapdragon 8 Gen 3 for Galaxy",
      "RAM 12GB, ROM 256GB",
      "Bút S-Pen tích hợp đa năng",
      "Camera Zoom 100x Space Zoom",
      "Khung viền Titanium chuẩn hàng không",
      "Màn Dynamic AMOLED 2X 120Hz"
    ],
    "image": "images/sp2.jpg",
    "description": "Trí tuệ nhân tạo Galaxy AI đột phá hỗ trợ khoanh vùng tìm kiếm Circle to Search và phiên dịch trực tiếp cuộc gọi, kết hợp camera 200MP zoom quang 100x và bút S-Pen quyền năng.",
    "reviews": [
      {
        "id": "rev_sp2_1",
        "author": "Hoàng Nam",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
        "stars": 5,
        "date": "2 ngày trước",
        "variant": "Titanium Gray, 256GB",
        "comment": "Máy chụp zoom 10x và 100x cực nét, giữ chi tiết rất tốt ngay cả khi quay concert ban đêm. Màn hình phẳng chống chói xuất sắc.",
        "likes": 32,
        "verified": true
      },
      {
        "id": "rev_sp2_2",
        "author": "Mai Anh",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
        "stars": 5,
        "date": "5 ngày trước",
        "variant": "Titanium Black, 256GB",
        "comment": "AI dịch trực tiếp cuộc gọi và tóm tắt ghi âm cuộc họp rất tiện cho công việc. Bút S-Pen viết ký hợp đồng điện tử êm ru.",
        "likes": 21,
        "verified": true
      },
      {
        "id": "rev_sp2_3",
        "author": "Quốc Đạt",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
        "stars": 5,
        "date": "1 tuần trước",
        "variant": "Titanium Yellow, 512GB",
        "comment": "Snapdragon 8 Gen 3 quá mạnh, chiến game Genshin hay PUBG đều max settings 60fps mượt mà, máy chỉ hơi ấm nhẹ không hề tụt xung.",
        "likes": 14,
        "verified": true
      }
    ]
  },
  {
    "id": "sp3",
    "name": "Laptop Gaming ASUS ROG Strix G16 i9 RTX 4080",
    "category": "laptop",
    "brand": "Asus",
    "originalPrice": 56990000,
    "price": 49990000,
    "oldPrice": 56990000,
    "discountPercent": 12,
    "isInstallment": true,
    "rating": 4.8,
    "reviewCount": 420,
    "soldCount": "850",
    "totalStock": 100,
    "isFlashSale": true,
    "specs": [
      "Core i9-14900HX 24 nhân 32 luồng",
      "NVIDIA RTX 4080 12GB GDDR6",
      "RAM 32GB DDR5 5600MHz",
      "Màn 16\" 2.5K 240Hz Nebula 100% DCI-P3",
      "Tản nhiệt 3 quạt kim loại lỏng Tri-Fan"
    ],
    "image": "images/sp3.jpg",
    "description": "Cỗ máy gaming đỉnh cao với hệ thống tản nhiệt 3 quạt kim loại lỏng Conductonaut Extreme, màn hình ROG Nebula 240Hz sắc nét, cân mượt mọi tựa game AAA và render 3D hạng nặng.",
    "reviews": [
      {
        "id": "rev_sp3_1",
        "author": "Đức Trọng",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
        "stars": 5,
        "date": "3 ngày trước",
        "variant": "Eclipse Gray, i9 / RTX 4080",
        "comment": "Cân mượt Cyberpunk 2077 bật Ray Tracing ở độ phân giải 2K vẫn giữ vững trên 95fps. Hệ thống 3 quạt tản nhiệt kim loại lỏng làm mát cực nhanh.",
        "likes": 19,
        "verified": true
      },
      {
        "id": "rev_sp3_2",
        "author": "Minh Hải",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        "stars": 5,
        "date": "1 tuần trước",
        "variant": "Eclipse Gray, 32GB RAM",
        "comment": "Màn hình 240Hz chuẩn 100% DCI-P3 màu sắc chuẩn chỉnh cho cả edit Premiere lẫn bắn Valorant. Bàn phím gõ êm, led RGB per-key cực bắt mắt.",
        "likes": 15,
        "verified": true
      },
      {
        "id": "rev_sp3_3",
        "author": "Quang Huy",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80",
        "stars": 4,
        "date": "2 tuần trước",
        "variant": "Eclipse Gray, 1TB SSD",
        "comment": "Máy build chắc chắn, hiệu năng i9-14900HX quá khủng. Quạt chạy full load có hơi hú nhẹ ở chế độ Turbo nhưng nhiệt độ CPU chỉ loanh quanh 78 độ.",
        "likes": 8,
        "verified": true
      }
    ]
  },
  {
    "id": "sp4",
    "name": "Tai nghe Bluetooth Apple AirPods Pro 2 2023 Type-C",
    "category": "audio",
    "brand": "Apple",
    "originalPrice": 6190000,
    "price": 5390000,
    "oldPrice": 6190000,
    "discountPercent": 13,
    "isInstallment": true,
    "rating": 4.9,
    "reviewCount": 2350,
    "soldCount": "4.8k",
    "totalStock": 100,
    "isFlashSale": true,
    "specs": [
      "Chip âm thanh Apple H2 thế hệ mới",
      "Cổng sạc Type-C chuẩn mới & MagSafe",
      "Chống ồn chủ động ANC 2X mạnh mẽ",
      "Âm thanh vòm Spatial Audio theo dõi đầu",
      "Thời lượng pin 30 giờ kèm hộp sạc"
    ],
    "image": "images/sp4.jpg",
    "description": "Khử ồn chủ động gấp 2 lần, chế độ Xuyên âm thích ứng thông minh cùng cổng sạc USB-C hiện đại, chống bụi chống nước chuẩn IP54 bền bỉ và hộp sạc tích hợp loa tìm kiếm Find My.",
    "reviews": [
      {
        "id": "rev_sp4_1",
        "author": "Khánh Linh",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
        "stars": 5,
        "date": "Hôm qua",
        "variant": "Trắng Type-C MagSafe",
        "comment": "Khả năng chống ồn ANC đỉnh thực sự, đi xe bus hay ngồi quán cafe ồn ào bật lên là như ở không gian riêng. Cổng Type-C đồng bộ với iPhone 16 rất tiện.",
        "likes": 28,
        "verified": true
      },
      {
        "id": "rev_sp4_2",
        "author": "Anh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
        "stars": 5,
        "date": "4 ngày trước",
        "variant": "Trắng Type-C",
        "comment": "Âm bass chắc và ấm hơn đời 1 rõ rệt, tính năng Adaptive Audio tự hạ âm lượng khi mình nói chuyện cực kỳ thông minh.",
        "likes": 16,
        "verified": true
      },
      {
        "id": "rev_sp4_3",
        "author": "Thảo My",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
        "stars": 5,
        "date": "1 tuần trước",
        "variant": "Trắng Type-C MagSafe",
        "comment": "Hộp sạc có loa phát tiếng kêu khi tìm qua Find My rất hữu ích với đứa hay quên như mình. Giao hàng 2h nhận ngay trong chiều.",
        "likes": 12,
        "verified": true
      }
    ]
  },
  {
    "id": "sp5",
    "name": "Đồng hồ Apple Watch Ultra 2 49mm Titan Dây Alpine",
    "category": "watch",
    "brand": "Apple",
    "originalPrice": 25990000,
    "price": 19490000,
    "oldPrice": 25990000,
    "discountPercent": 25,
    "isInstallment": true,
    "rating": 4.9,
    "reviewCount": 680,
    "soldCount": "1.1k",
    "totalStock": 30,
    "isFlashSale": true,
    "specs": [
      "Vỏ Titanium 49mm chống va đập",
      "Độ sáng màn hình 3000 nits đỉnh cao",
      "GPS băng tần kép tần số L1 và L5",
      "Thời lượng pin đến 72 giờ chế độ tiết kiệm",
      "Chống nước 100m, lặn sâu 40m"
    ],
    "image": "images/sp5.jpg",
    "description": "Đỉnh cao đồng hồ thể thao chuyên nghiệp với màn hình sáng 3000 nits thách thức nắng gắt, định vị GPS tần số kép chuẩn xác và thời lượng pin bền bỉ đến 72 giờ cho thám hiểm dã ngoại.",
    "reviews": [
      {
        "id": "rev_sp5_1",
        "author": "Việt Dũng",
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&q=80",
        "stars": 5,
        "date": "3 ngày trước",
        "variant": "Titanium, Dây Alpine Cam",
        "comment": "Màn hình 3000 nits chạy bộ dưới trời trưa nắng gắt vẫn nhìn rõ mồn một. Vỏ titan cứng cáp va quẹt không để lại vết xước nào.",
        "likes": 17,
        "verified": true
      },
      {
        "id": "rev_sp5_2",
        "author": "Thanh Phong",
        "avatar": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&q=80",
        "stars": 5,
        "date": "1 tuần trước",
        "variant": "Titanium, Dây Alpine Xanh",
        "comment": "Pin dùng bình thường được gần 3 ngày mới phải sạc. Thao tác cử chỉ Double Tap chạm 2 ngón tay nghe cuộc gọi rất tiện khi đang lái xe.",
        "likes": 14,
        "verified": true
      }
    ]
  },
  {
    "id": "sp6",
    "name": "Xiaomi 14 Ultra 16GB 512GB Leica Summilux",
    "category": "phone",
    "brand": "Xiaomi",
    "originalPrice": 32990000,
    "price": 28990000,
    "oldPrice": 32990000,
    "discountPercent": 12,
    "isInstallment": true,
    "rating": 4.8,
    "reviewCount": 540,
    "soldCount": "920",
    "totalStock": 50,
    "isFlashSale": false,
    "specs": [
      "Ống kính quang học Leica Summilux 4 camera",
      "Cảm biến Sony LYT-900 1 inch cao cấp",
      "Snapdragon 8 Gen 3, RAM 16GB LPDDR5X",
      "Màn hình 2K AMOLED 120Hz 3000 nits",
      "Pin 5000mAh, sạc nhanh 90W có dây & 80W không dây"
    ],
    "image": "images/sp6.jpg",
    "description": "Kiệt tác nhiếp ảnh di động đỉnh cao hợp tác cùng Leica, trang bị cảm biến 1 inch thế hệ mới với khẩu độ vô cấp mượt mà từ f/1.63 đến f/4.0 cùng màn hình cong bốn cạnh siêu đẹp.",
    "reviews": [
      {
        "id": "rev_sp6_1",
        "author": "Văn Hưng",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
        "stars": 5,
        "date": "2 ngày trước",
        "variant": "Đen Da Nano, 512GB",
        "comment": "Màu ảnh Leica chân thực, chụp chân dung xóa phông tự nhiên như máy ảnh cơ chuyên nghiệp. Màn hình 2K siêu sáng và trong trẻo.",
        "likes": 19,
        "verified": true
      },
      {
        "id": "rev_sp6_2",
        "author": "Tấn Tài",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        "stars": 5,
        "date": "1 tuần trước",
        "variant": "Trắng Da Nano, 512GB",
        "comment": "Khẩu độ cơ học thay đổi được f/1.63 - f/4.0 chụp ngược sáng không bị cháy. Sạc 90W chỉ 30 phút là đầy 100% pin.",
        "likes": 11,
        "verified": true
      }
    ]
  },
  {
    "id": "sp7",
    "name": "MacBook Pro 14 inch M3 Pro 18GB 512GB Space Black",
    "category": "laptop",
    "brand": "Apple",
    "originalPrice": 49990000,
    "price": 45490000,
    "oldPrice": 49990000,
    "discountPercent": 9,
    "isInstallment": true,
    "rating": 4.9,
    "reviewCount": 890,
    "soldCount": "1.5k",
    "totalStock": 40,
    "isFlashSale": false,
    "specs": [
      "Chip Apple M3 Pro 11-core CPU, 14-core GPU",
      "RAM 18GB Unified Memory",
      "SSD 512GB siêu tốc 5000MB/s",
      "Màn Liquid Retina XDR 120Hz ProMotion",
      "Thời lượng pin lên tới 18 giờ liên tục"
    ],
    "image": "images/sp7.jpg",
    "description": "Sức mạnh đồ họa đỉnh cao với chip M3 Pro tiến trình 3nm, màu đen Space Black chống bám vân tay sang trọng và màn hình Liquid Retina XDR độ sáng 1600 nits đỉnh cao.",
    "reviews": [
      {
        "id": "rev_sp7_1",
        "author": "Hoàng Bách",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
        "stars": 5,
        "date": "4 ngày trước",
        "variant": "Space Black, 18GB/512GB",
        "comment": "Màu Space Black nhìn thực tế sang và ngầu hơn hẳn đời trước, lớp phủ anode chống bám vân tay hoạt động rất tốt.",
        "likes": 22,
        "verified": true
      },
      {
        "id": "rev_sp7_2",
        "author": "Nhật Minh",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
        "stars": 5,
        "date": "1 tuần trước",
        "variant": "Space Black, 18GB/512GB",
        "comment": "Render video 4K trên Final Cut Pro nhanh như gió mà máy vẫn êm ru không nghe tiếng quạt. Pin dùng làm việc cả ngày ở quán cafe không cần mang sạc.",
        "likes": 17,
        "verified": true
      }
    ]
  },
  {
    "id": "sp8",
    "name": "Tai nghe Chống ồn Sony WH-1000XM5 Hi-Res Audio",
    "category": "audio",
    "brand": "Sony",
    "originalPrice": 8990000,
    "price": 6990000,
    "oldPrice": 8990000,
    "discountPercent": 22,
    "isInstallment": true,
    "rating": 4.8,
    "reviewCount": 1120,
    "soldCount": "2.1k",
    "totalStock": 60,
    "isFlashSale": false,
    "specs": [
      "Bộ xử lý chống ồn V1 & HD QN1 kép đỉnh cao",
      "8 micro thu âm lọc ồn đàm thoại AI",
      "Driver 30mm màng sợi carbon siêu nhẹ",
      "Hỗ trợ Hi-Res Audio & codec LDAC không dây",
      "Pin 30 giờ, sạc nhanh 3 phút dùng 3 giờ"
    ],
    "image": "images/sp8.jpg",
    "description": "Chuẩn mực tai nghe chống ồn over-ear hàng đầu thế giới với hệ thống 8 micro lọc ồn thông minh, âm thanh chuẩn Hi-Res không dây qua codec LDAC và trọng lượng siêu nhẹ 250g.",
    "reviews": [
      {
        "id": "rev_sp8_1",
        "author": "Đình Trọng",
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&q=80",
        "stars": 5,
        "date": "Hôm qua",
        "variant": "Đen Nhám Hi-Res",
        "comment": "Chống ồn tốt nhất phân khúc, đeo lên tai bay chuyến dài không hề mệt hay bí tai. Đệm da êm ái, đàm thoại lọc gió rất rõ.",
        "likes": 18,
        "verified": true
      },
      {
        "id": "rev_sp8_2",
        "author": "Thu Trang",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
        "stars": 5,
        "date": "5 ngày trước",
        "variant": "Bạc Platinum",
        "comment": "Chất âm chi tiết, dải mid và treble trong veo, nghe acoustic hay ballad đều rất cảm xúc. Pin trâu nghe cả tuần mới sạc một lần.",
        "likes": 12,
        "verified": true
      }
    ]
  },
  {
    "id": "sp9",
    "name": "Đồng hồ thông minh Garmin Forerunner 265 GPS",
    "category": "watch",
    "brand": "Garmin",
    "originalPrice": 11990000,
    "price": 10490000,
    "oldPrice": 11990000,
    "discountPercent": 12,
    "isInstallment": true,
    "rating": 4.9,
    "reviewCount": 630,
    "soldCount": "1.3k",
    "totalStock": 45,
    "isFlashSale": false,
    "specs": [
      "Màn hình AMOLED cảm ứng rực rỡ 1.3\"",
      "Đo chỉ số sẵn sàng luyện tập Training Readiness",
      "GPS đa băng tần siêu chính xác",
      "Thời lượng pin 13 ngày chế độ smartwatch",
      "Bộ nhớ lưu nhạc trực tiếp Spotify"
    ],
    "image": "images/sp9.jpg",
    "description": "Người bạn đồng hành hoàn hảo cho runner chuyên nghiệp với màn hình cảm ứng AMOLED rực rỡ, GPS đa băng tần chính xác tuyệt đối và gợi ý bài tập thích ứng hàng ngày.",
    "reviews": [
      {
        "id": "rev_sp9_1",
        "author": "Phan Anh",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
        "stars": 5,
        "date": "4 ngày trước",
        "variant": "Đen Dây Silicone Vàng",
        "comment": "Màn hình AMOLED hiển thị dưới nắng cực rõ, GPS bắt sóng nhanh chỉ mất 3 giây. Tính năng đo độ sẵn sàng luyện tập giúp mình tránh chấn thương hiệu quả.",
        "likes": 20,
        "verified": true
      },
      {
        "id": "rev_sp9_2",
        "author": "Hải Yến",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        "stars": 5,
        "date": "1 tuần trước",
        "variant": "Trắng Dây Xanh",
        "comment": "Nhẹ tênh khi đeo chạy marathon 42km, đo nhịp tim và cadence chuẩn xác. Pin 13 ngày cực kỳ trâu không lo hết pin giữa chừng.",
        "likes": 15,
        "verified": true
      }
    ]
  },
  {
    "id": "sp10",
    "name": "Bàn phím cơ không dây Keychron K2 Pro QMK/VIA",
    "category": "accessory",
    "brand": "Keychron",
    "originalPrice": 2490000,
    "price": 2090000,
    "oldPrice": 2490000,
    "discountPercent": 16,
    "isInstallment": false,
    "rating": 4.8,
    "reviewCount": 780,
    "soldCount": "1.9k",
    "totalStock": 80,
    "isFlashSale": false,
    "specs": [
      "Layout 75% gọn gàng 84 phím bấm",
      "Tùy biến keymap qua phần mềm QMK/VIA",
      "Keycap PBT Double-shot OSA profile",
      "Mạch Hotswap thay switch nóng dễ dàng",
      "Kết nối Bluetooth 5.1 & Type-C cho Mac/Win"
    ],
    "image": "images/sp10.jpg",
    "description": "Bàn phím cơ công thái học hoàn hảo cho lập trình viên và dân văn phòng với khả năng tùy biến keymap qua QMK/VIA, foam tiêu âm silicon êm ái và switch hotswap tiện lợi.",
    "reviews": [
      {
        "id": "rev_sp10_1",
        "author": "Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
        "stars": 5,
        "date": "2 ngày trước",
        "variant": "Red Switch, Khung Nhôm",
        "comment": "Gõ cực kỳ đầm tay, switch Red bôi trơn sẵn mượt mà không bị lọc xọc. Kết nối mượt mà giữa MacBook và máy bàn Windows chỉ qua 1 nút gạt.",
        "likes": 16,
        "verified": true
      },
      {
        "id": "rev_sp10_2",
        "author": "Hoàng Long",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        "stars": 5,
        "date": "1 tuần trước",
        "variant": "Brown Switch, Khung Nhựa",
        "comment": "Keycap PBT double-shot chống bóng mồ hôi tay rất tốt, layout 75% nhỏ gọn để vừa balo đi làm. Pin dùng Bluetooth hơn 2 tuần mới phải sạc.",
        "likes": 11,
        "verified": true
      }
    ]
  },
  {
    "id": "sp11",
    "name": "Chuột Gaming không dây Logitech G Pro X Superlight",
    "category": "accessory",
    "brand": "Logitech",
    "originalPrice": 3290000,
    "price": 2490000,
    "oldPrice": 3290000,
    "discountPercent": 24,
    "isInstallment": false,
    "rating": 4.9,
    "reviewCount": 1650,
    "soldCount": "3.6k",
    "totalStock": 90,
    "isFlashSale": false,
    "specs": [
      "Trọng lượng siêu nhẹ dưới 63 gram",
      "Cảm biến HERO 25K DPI chuẩn xác từng pixel",
      "Công nghệ không dây Lightspeed độ trễ 1ms",
      "Feet chuột PTFE nguyên chất lướt êm ái",
      "Thời lượng pin lên tới 70 giờ liên tục"
    ],
    "image": "images/sp11.jpg",
    "description": "Vũ khí tối thượng của các tuyển thủ eSports chuyên nghiệp với trọng lượng siêu nhẹ dưới 63g, cảm biến HERO 25K chính xác từng pixel và kết nối không dây Lightspeed không độ trễ.",
    "reviews": [
      {
        "id": "rev_sp11_1",
        "author": "Bá Tùng",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80",
        "stars": 5,
        "date": "3 ngày trước",
        "variant": "Trắng White Edition",
        "comment": "Chuột nhẹ như không cầm gì, vẩy flick trong CS2 và Valorant cực kỳ chuẩn xác. Pin cả tháng mới cần cắm sạc một lần.",
        "likes": 25,
        "verified": true
      },
      {
        "id": "rev_sp11_2",
        "author": "Quang Anh",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
        "stars": 5,
        "date": "1 tuần trước",
        "variant": "Đen Black Edition",
        "comment": "Cảm biến HERO 25K không bao giờ bị giật hay mất tracking, feet chuột trượt trên lót chuột êm ru không một chút cọ xát.",
        "likes": 13,
        "verified": true
      }
    ]
  },
  {
    "id": "sp12",
    "name": "Củ sạc nhanh GaN Anker 735 65W 3 Cổng Type-C",
    "category": "accessory",
    "brand": "Anker",
    "originalPrice": 1290000,
    "price": 890000,
    "oldPrice": 1290000,
    "discountPercent": 31,
    "isInstallment": false,
    "rating": 4.9,
    "reviewCount": 3100,
    "soldCount": "6.5k",
    "totalStock": 150,
    "isFlashSale": false,
    "specs": [
      "Công nghệ GaNPrime thế hệ mới nhỏ gọn",
      "Công suất tối đa 65W sạc nhanh laptop & điện thoại",
      "3 cổng ra (2 Type-C + 1 USB-A)",
      "Công nghệ phân bổ nguồn thông minh PowerIQ 4.0",
      "Bảo vệ nhiệt độ ActiveShield 2.0 an toàn"
    ],
    "image": "images/sp12.jpg",
    "description": "Củ sạc công nghệ bán dẫn GaNPrime siêu nhỏ gọn chỉ bằng 50% sạc truyền thống, công suất mạnh mẽ 65W sạc cùng lúc MacBook, iPhone và tai nghe an toàn tuyệt đối.",
    "reviews": [
      {
        "id": "rev_sp12_1",
        "author": "Thanh Tùng",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
        "stars": 5,
        "date": "Hôm qua",
        "variant": "Đen Nhám GaNPrime 65W",
        "comment": "Sạc được cả MacBook Air và iPhone cùng lúc mà củ sạc chỉ ấm nhẹ, không hề nóng ran như củ sạc cũ. Kích thước nhỏ gọn mang đi du lịch tiện lợi.",
        "likes": 34,
        "verified": true
      },
      {
        "id": "rev_sp12_2",
        "author": "Mai Phương",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
        "stars": 5,
        "date": "4 ngày trước",
        "variant": "Xám Bạc GaNPrime",
        "comment": "Hàng Anker thì khỏi lo về độ bền, sạc chuẩn Power Delivery nhận sạc nhanh lập tức. Đóng gói cẩn thận, shipper giao nhanh.",
        "likes": 19,
        "verified": true
      }
    ]
  },
  {
    "id": "sp13",
    "name": "iPad Air M2 11 inch 128GB Wifi Chính Hãng Apple",
    "category": "phone",
    "brand": "Apple",
    "originalPrice": 16990000,
    "price": 14790000,
    "oldPrice": 16990000,
    "discountPercent": 13,
    "isInstallment": true,
    "rating": 4.9,
    "reviewCount": 1150,
    "soldCount": "2.2k",
    "totalStock": 55,
    "isFlashSale": false,
    "specs": [
      "Chip Apple M2 mạnh mẽ đồ họa vượt trội",
      "Màn hình Liquid Retina 11\" True Tone",
      "Hỗ trợ Apple Pencil Pro & Magic Keyboard",
      "Camera trước ngang 12MP Center Stage",
      "Wifi 6E siêu tốc, loa kép stereo"
    ],
    "image": "images/sp13.jpg",
    "description": "Chiếc máy tính bảng đa năng hoàn hảo với sức mạnh chip Apple M2, hỗ trợ bút Apple Pencil Pro thế hệ mới với cử chỉ bóp thông minh và camera trước đặt ngang thuận tiện cho họp online.",
    "reviews": [
      {
        "id": "rev_sp13_1",
        "author": "Ngọc Ánh",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        "stars": 5,
        "date": "2 ngày trước",
        "variant": "Xanh Dương Starlight, 128GB",
        "comment": "Vẽ trên iPad Air M2 với Apple Pencil Pro cực mượt, lực nhấn và cảm biến xoay nét cọ rất nhạy. Màn hình màu sắc chuẩn chỉnh.",
        "likes": 21,
        "verified": true
      },
      {
        "id": "rev_sp13_2",
        "author": "Duy Khoa",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
        "stars": 5,
        "date": "1 tuần trước",
        "variant": "Xám Không Gian, 128GB",
        "comment": "Chip M2 xử lý file đồ họa và dựng clip CapCut 4K mượt mà, máy mỏng nhẹ cầm đọc tài liệu rất thoải mái.",
        "likes": 14,
        "verified": true
      }
    ]
  },
  {
    "id": "sp14",
    "name": "Laptop Dell XPS 15 9530 Core i7 RTX 4050 OLED",
    "category": "laptop",
    "brand": "Dell",
    "originalPrice": 52990000,
    "price": 46990000,
    "oldPrice": 52990000,
    "discountPercent": 11,
    "isInstallment": true,
    "rating": 4.8,
    "reviewCount": 360,
    "soldCount": "680",
    "totalStock": 35,
    "isFlashSale": false,
    "specs": [
      "Intel Core i7-13700H 14 nhân 20 luồng",
      "NVIDIA GeForce RTX 4050 6GB GDDR6",
      "Màn hình 15.6\" 3.5K OLED Cảm ứng 400 nits",
      "RAM 16GB DDR5, SSD 1TB NVMe",
      "Vỏ nhôm CNC nguyên khối & sợi carbon"
    ],
    "image": "images/sp14.jpg",
    "description": "Biểu tượng laptop doanh nhân và sáng tạo nội dung đỉnh cao với khung nhôm CNC nguyên khối kết hợp chiếu nghỉ tay sợi carbon, màn hình 3.5K OLED rực rỡ và card đồ họa rời RTX 4050.",
    "reviews": [
      {
        "id": "rev_sp14_1",
        "author": "Hoàng Nam",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
        "stars": 5,
        "date": "4 ngày trước",
        "variant": "Platinum Silver / Carbon Black",
        "comment": "Màn hình 3.5K OLED màu đen sâu tuyệt đối, làm ảnh Photoshop hay xem phim HDR màu sắc đẹp mê ly. Vỏ nhôm CNC sờ vào cực kỳ mát và sang.",
        "likes": 16,
        "verified": true
      },
      {
        "id": "rev_sp14_2",
        "author": "Vũ Hoàng",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        "stars": 4,
        "date": "10 ngày trước",
        "variant": "16GB RAM / 1TB SSD",
        "comment": "Touchpad to bản rê chuột chính xác nhất giới laptop Windows, bàn phím gõ êm, máy chạy đồ họa mượt mà.",
        "likes": 9,
        "verified": true
      }
    ]
  },
  {
    "id": "sp15",
    "name": "Loa Bluetooth di động Marshall Emberton II 20W",
    "category": "audio",
    "brand": "Marshall",
    "originalPrice": 4490000,
    "price": 3690000,
    "oldPrice": 4490000,
    "discountPercent": 18,
    "isInstallment": false,
    "rating": 4.8,
    "reviewCount": 1420,
    "soldCount": "2.8k",
    "totalStock": 75,
    "isFlashSale": false,
    "specs": [
      "Âm thanh đa hướng True Stereophonic 360°",
      "Công suất 20W RMS âm thanh chi tiết",
      "Thời lượng pin hơn 30 giờ chơi nhạc",
      "Kháng nước & kháng bụi chuẩn IP67",
      "Chế độ ghép đôi Stack Mode nhiều loa"
    ],
    "image": "images/sp15.jpg",
    "description": "Chất âm rock mộc mạc đặc trưng của Marshall trong thân hình di động nhỏ gọn, công nghệ âm thanh đa hướng 360 độ và khả năng chơi nhạc bền bỉ trên 30 giờ cho mọi chuyến dã ngoại.",
    "reviews": [
      {
        "id": "rev_sp15_1",
        "author": "Trung Hiếu",
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&q=80",
        "stars": 5,
        "date": "2 ngày trước",
        "variant": "Black & Brass (Đen Viền Vàng)",
        "comment": "Thiết kế vintage kinh điển để bàn làm việc rất đẹp, âm bass chắc nịch và vocal ca sĩ nổi rõ. Pin 30 tiếng nghe mãi không hết.",
        "likes": 23,
        "verified": true
      },
      {
        "id": "rev_sp15_2",
        "author": "Hà My",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
        "stars": 5,
        "date": "1 tuần trước",
        "variant": "Cream (Kem Sữa)",
        "comment": "Chống nước IP67 mang ra bờ biển hay hồ bơi tiệc tùng thoải mái. Loa cầm đầm tay, chất lượng hoàn thiện da cao cấp.",
        "likes": 15,
        "verified": true
      }
    ]
  },
  {
    "id": "sp16",
    "name": "Pin sạc dự phòng Baseus Blade 100W 20.000mAh",
    "category": "accessory",
    "brand": "Baseus",
    "originalPrice": 1690000,
    "price": 1250000,
    "oldPrice": 1690000,
    "discountPercent": 26,
    "isInstallment": false,
    "rating": 4.8,
    "reviewCount": 1890,
    "soldCount": "3.7k",
    "totalStock": 110,
    "isFlashSale": false,
    "specs": [
      "Công suất sạc cực đại 100W Type-C",
      "Dung lượng 20.000mAh chuẩn an toàn hàng không",
      "Màn hình LED kỹ thuật số hiển thị điện áp & thời gian",
      "Thiết kế siêu mỏng 18mm để vừa ngăn balo",
      "4 cổng sạc (2 Type-C + 2 USB-A)"
    ],
    "image": "images/sp16.jpg",
    "description": "Cục pin dự phòng mỏng nhất phân khúc sạc nhanh 100W, sạc đầy laptop MacBook Pro chỉ trong 1.5 giờ, màn hình LED hiển thị trực quan thông số điện áp và thời gian còn lại.",
    "reviews": [
      {
        "id": "rev_sp16_1",
        "author": "Quốc Cường",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
        "stars": 5,
        "date": "Hôm qua",
        "variant": "Đen Nhám 100W Blade",
        "comment": "Sạc được cho laptop ThinkPad và Dell XPS ở công suất 100W mượt mà, mỏng dẹt như cuốn sổ nhét balo rất tiện.",
        "likes": 26,
        "verified": true
      },
      {
        "id": "rev_sp16_2",
        "author": "Kim Ngân",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
        "stars": 5,
        "date": "5 ngày trước",
        "variant": "20.000mAh 100W",
        "comment": "Màn hình báo phần trăm pin và số phút sạc còn lại rất trực quan, mang lên máy bay đi công tác vô tư.",
        "likes": 14,
        "verified": true
      }
    ]
  },
  {
    "id": "sp17",
    "name": "Ổ cứng SSD Samsung 990 Pro 1TB NVMe PCIe Gen 4",
    "category": "accessory",
    "brand": "Samsung",
    "originalPrice": 3290000,
    "price": 2790000,
    "oldPrice": 3290000,
    "discountPercent": 15,
    "isInstallment": false,
    "rating": 4.9,
    "reviewCount": 1720,
    "soldCount": "3.9k",
    "totalStock": 85,
    "isFlashSale": false,
    "specs": [
      "Tốc độ đọc tuần tự lên đến 7450 MB/s",
      "Tốc độ ghi tuần tự 6900 MB/s",
      "Giao thức PCIe Gen 4.0 x4, NVMe 2.0",
      "Chip điều khiển Pascal tối ưu nhiệt độ",
      "Độ bền 600 TBW, bảo hành chính hãng 5 năm"
    ],
    "image": "images/sp17.jpg",
    "description": "Tốc độ đọc ghi chạm giới hạn băng thông PCIe 4.0 lên tới 7450 MB/s, tối ưu cho PC gaming hạng nặng, máy trạm workstation và tương thích hoàn hảo để nâng cấp ổ cứng máy chơi game PS5.",
    "reviews": [
      {
        "id": "rev_sp17_1",
        "author": "Thái Sơn",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80",
        "stars": 5,
        "date": "3 ngày trước",
        "variant": "1TB PCIe Gen 4.0",
        "comment": "Tốc độ đọc 7450MB/s load game Cyberpunk và Hogwarts Legacy trong 2 giây. Lắp vào PS5 nhận ngay lập tức.",
        "likes": 28,
        "verified": true
      },
      {
        "id": "rev_sp17_2",
        "author": "Huy Hoàng",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
        "stars": 5,
        "date": "1 tuần trước",
        "variant": "1TB Không Tản",
        "comment": "Samsung 990 Pro thì ổn định hàng đầu rồi, nhiệt độ khi copy file nặng 100GB chỉ tầm 48 độ với tản nhiệt bo mạch.",
        "likes": 16,
        "verified": true
      }
    ]
  },
  {
    "id": "sp18",
    "name": "Samsung Galaxy Z Fold6 5G 12GB 256GB Silver",
    "category": "phone",
    "brand": "Samsung",
    "originalPrice": 43990000,
    "price": 38990000,
    "oldPrice": 43990000,
    "discountPercent": 11,
    "isInstallment": true,
    "rating": 4.8,
    "reviewCount": 710,
    "soldCount": "1.2k",
    "totalStock": 40,
    "isFlashSale": false,
    "specs": [
      "Thiết kế bản lề rãnh kép FlexHinge gập khít",
      "Màn hình chính 7.6\" Dynamic AMOLED 2X 2600 nits",
      "Snapdragon 8 Gen 3 for Galaxy tối ưu đa nhiệm",
      "Bộ công cụ Galaxy AI trên màn hình lớn",
      "Khung nhôm Armor Aluminum & kính Victus 2"
    ],
    "image": "images/sp18.jpg",
    "description": "Đỉnh cao smartphone màn hình gập mỏng nhẹ và vuông vắn nhất từ trước đến nay, mở ra không gian làm việc đa nhiệm 7.6 inch kết hợp cùng sức mạnh Galaxy AI đột phá.",
    "reviews": [
      {
        "id": "rev_sp18_1",
        "author": "Trần Lâm",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
        "stars": 5,
        "date": "2 ngày trước",
        "variant": "Silver Shadow, 256GB",
        "comment": "Bản lề gập khít hoàn toàn, màn hình ngoài rộng hơn gõ bàn phím không bị hụt tay như Fold5. Mở màn hình lớn xem biểu đồ chứng khoán cực đã.",
        "likes": 22,
        "verified": true
      },
      {
        "id": "rev_sp18_2",
        "author": "Thảo Uyên",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
        "stars": 5,
        "date": "6 ngày trước",
        "variant": "Navy Blue, 256GB",
        "comment": "Tính năng dịch song ngữ 2 chiều trên 2 màn hình khi đi du lịch nước ngoài cực kỳ xịn sò. Máy mỏng và nhẹ hơn đáng kể.",
        "likes": 13,
        "verified": true
      }
    ]
  },
  {
    "id": "sp19",
    "name": "Màn hình gaming ASUS TUF VG27AQ3A 27\" 2K 180Hz",
    "category": "laptop",
    "brand": "Asus",
    "originalPrice": 6990000,
    "price": 5490000,
    "oldPrice": 6990000,
    "discountPercent": 21,
    "isInstallment": true,
    "rating": 4.8,
    "reviewCount": 940,
    "soldCount": "2.1k",
    "totalStock": 70,
    "isFlashSale": false,
    "specs": [
      "Kích thước 27 inch độ phân giải 2K QHD (2560x1440)",
      "Tần số quét 180Hz mượt mà",
      "Tấm nền Fast IPS tốc độ phản hồi 1ms GTG",
      "Công nghệ đồng bộ G-Sync Compatible & FreeSync",
      "Hỗ trợ HDR10 và 130% sRGB chuẩn màu"
    ],
    "image": "images/sp19.jpg",
    "description": "Màn hình gaming chuẩn thi đấu eSports với độ phân giải 2K sắc nét trên kích thước 27 inch, tần số quét 180Hz kết hợp tấm nền Fast IPS 1ms loại bỏ hoàn toàn hiện tượng bóng mờ và xé hình.",
    "reviews": [
      {
        "id": "rev_sp19_1",
        "author": "Nam Phong",
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&q=80",
        "stars": 5,
        "date": "4 ngày trước",
        "variant": "27 inch 2K 180Hz Fast IPS",
        "comment": "Độ phân giải 2K 180Hz quá mượt cho các tựa game FPS, tấm nền Fast IPS màu sắc trong trẻo không bị hở sáng.",
        "likes": 19,
        "verified": true
      },
      {
        "id": "rev_sp19_2",
        "author": "Văn Chiến",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        "stars": 4,
        "date": "1 tuần trước",
        "variant": "27 inch 2K",
        "comment": "Chân đế chắc chắn, hỗ trợ ngàm VESA để gắn arm màn hình. Giá quá tốt cho một chiếc màn 2K 180Hz từ ASUS.",
        "likes": 10,
        "verified": true
      }
    ]
  },
  {
    "id": "sp20",
    "name": "Đồng hồ Samsung Galaxy Watch 6 Classic 43mm LTE",
    "category": "watch",
    "brand": "Samsung",
    "originalPrice": 8990000,
    "price": 6490000,
    "oldPrice": 8990000,
    "discountPercent": 28,
    "isInstallment": true,
    "rating": 4.8,
    "reviewCount": 820,
    "soldCount": "1.6k",
    "totalStock": 65,
    "isFlashSale": false,
    "specs": [
      "Viền xoay bezel vật lý cổ điển trứ danh",
      "Kính Sapphire chống trầy xước cao cấp",
      "Cảm biến BioActive đo ECG & huyết áp",
      "Theo dõi giấc ngủ chuyên sâu phân tích giấc ngủ",
      "Hỗ trợ eSIM độc lập nghe gọi không cần điện thoại"
    ],
    "image": "images/sp20.jpg",
    "description": "Sự trở lại của viền bezel xoay vật lý trứ danh kết hợp kính sapphire cao cấp, tính năng theo dõi giấc ngủ chuyên sâu và hỗ trợ eSIM nghe gọi độc lập không cần mang theo điện thoại.",
    "reviews": [
      {
        "id": "rev_sp20_1",
        "author": "Thanh Hải",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
        "stars": 5,
        "date": "Hôm qua",
        "variant": "Đen Black 43mm LTE",
        "comment": "Viền xoay vật lý lách cách cực kỳ thích tay và chuẩn xác, kính sapphire bóng bẩy không trầy xước. Đo điện tâm đồ ECG rất tiện theo dõi sức khỏe.",
        "likes": 21,
        "verified": true
      },
      {
        "id": "rev_sp20_2",
        "author": "Quỳnh Nga",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
        "stars": 5,
        "date": "5 ngày trước",
        "variant": "Bạc Silver 43mm LTE",
        "comment": "Add eSIM Viettel vào chạy bộ ngoài công viên vẫn nghe gọi và nhận tin nhắn bình thường, không cần cầm điện thoại lỉnh kỉnh.",
        "likes": 15,
        "verified": true
      }
    ]
  }
];

// Alias tương thích toàn bộ hệ thống
const TECHZONE_PRODUCTS = allProducts;


// INITIAL SAMPLE ORDERS WITH SHOPEE EXPRESS (SPX) BRANDING & FORMAT SPX-XXXXXX
const INITIAL_MOCK_ORDERS = [
  {
    id: 'SPX-892341',
    aliases: ['TZ-10823'],
    createdAt: '2026-10-20 10:15',
    status: 'Đang giao', // Options: 'Chờ xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'
    etaSeconds: 5400, // ~ 1 hour 30 mins
    etaText: '14:30 Hôm nay, 20-10-2026',
    shippingCourier: 'Shopee Express (SPX Speed)',
    shippingNotification: '🚚 [Hà Nội] Đơn hàng đang trên đường giao đến bạn bởi shipper Trần Hoàng Nam (0988.223.344)',
    shipper: {
      name: 'Trần Hoàng Nam',
      phone: '0988.223.344',
      plate: '29B1 - 892.45',
      rating: '4.98 ⭐ (1,840 chuyến hoàn thành)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'
    },
    customer: {
      name: 'Nguyễn Văn Minh',
      phone: '0912.889.900',
      address: 'Số 68 Phố Duy Tân, P. Dịch Vọng Hậu, Q. Cầu Giấy, Hà Nội',
      note: 'Giao trong giờ hành chính, gọi trước 10 phút'
    },
    shippingMethod: 'Giao Hỏa Tốc SPX Speed 2H',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    items: [
      {
        id: 'tz-fs-01',
        name: 'iPhone 16 Pro Max 256GB - Titanium Tự Nhiên',
        variant: '256GB, Titan Tự Nhiên',
        price: 34490000,
        quantity: 1,
        image: 'images/sp1.jpg'
      },
      {
        id: 'tz-acc-01',
        name: 'Củ sạc nhanh Anker 511 Nano 3 30W Type-C GaN',
        variant: 'Trắng GaN 30W',
        price: 320000,
        quantity: 1,
        image: 'images/sp12.jpg'
      }
    ],
    subtotal: 34810000,
    shippingFee: 0,
    discountAmount: 50000,
    total: 34760000,
    checkpoints: [
      { time: '11:15 Hôm nay', text: 'Shipper Trần Hoàng Nam (0988.223.344) đang giao hàng đến bạn. Vui lòng chú ý điện thoại.' },
      { time: '10:50 Hôm nay', text: 'Đơn hàng đã rời kho phân loại trung chuyển SPX Cầu Giấy Hub.' },
      { time: '10:15 Hôm nay', text: 'Đơn hàng đã đến trung tâm khai thác phân loại Hà Nội SOC.' },
      { time: '09:30 Hôm nay', text: 'Đơn vị vận chuyển Shopee Express (SPX) đã lấy hàng từ Người gửi.' },
      { time: '08:45 Hôm nay', text: 'Người gửi đang chuẩn bị hàng và đóng gói niêm phong chống sốc.' },
      { time: '08:15 Hôm nay', text: 'Đơn hàng đã được đặt thành công trên hệ thống.' }
    ]
  },
  {
    id: 'SPX-102948',
    aliases: ['TZ-24910'],
    createdAt: '2026-10-20 15:30',
    status: 'Chờ xác nhận',
    etaSeconds: 10800, // ~ 3 hours
    etaText: '18:30 Ngày mai, 21-10-2026',
    shippingCourier: 'Shopee Express (SPX Hỏa Tốc)',
    shippingNotification: '📦 Người gửi đang chuẩn bị hàng tại kho tổng SPX Hub Sài Gòn',
    shipper: {
      name: 'Đỗ Văn Tuấn',
      phone: '0977.112.334',
      plate: '59K2 - 689.12',
      rating: '4.9 ⭐ (980 chuyến)',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80'
    },
    customer: {
      name: 'Trần Thị Thu Thảo',
      phone: '0903.445.667',
      address: 'Phòng 1802, Chung cư Landmark Plus, Vinhomes Central Park, Q. Bình Thạnh, TP. Hồ Chí Minh',
      note: 'Gửi lễ tân sảnh nếu vắng nhà'
    },
    shippingMethod: 'Giao Tiêu Chuẩn 24H SPX',
    paymentMethod: 'Ví ShopeePay (Đã thanh toán)',
    items: [
      {
        id: 'tz-laptop-01',
        name: 'Apple MacBook Pro 14 M3 Pro (18GB / 512GB SSD)',
        variant: '18GB / 512GB, Space Black',
        price: 49490000,
        quantity: 1,
        image: 'images/sp7.jpg'
      }
    ],
    subtotal: 49490000,
    shippingFee: 0,
    discountAmount: 0,
    total: 49490000,
    checkpoints: [
      { time: '15:45 Hôm nay', text: 'Đơn hàng đã được xác nhận và in phiếu đóng kiện tại kho tổng SPX Sài Gòn.' },
      { time: '15:30 Hôm nay', text: 'Khách hàng hoàn tất thanh toán qua Ví ShopeePay. Hệ thống chuyển tiếp cho SPX.' }
    ]
  },
  {
    id: 'SPX-776219',
    aliases: ['TZ-38501'],
    createdAt: '2026-10-18 09:00',
    status: 'Đã giao',
    etaSeconds: 0,
    etaText: '11:15 18-10-2026 (Giao thành công)',
    shippingCourier: 'Shopee Express (SPX Tiêu Chuẩn)',
    shippingNotification: '✅ Giao hàng thành công - Người nhận: Hoàng Minh Đức đã ký nhận bưu kiện',
    shipper: {
      name: 'Nguyễn Quang Hải',
      phone: '0935.889.012',
      plate: '43D1 - 998.45',
      rating: '5.0 ⭐ (2,600 chuyến)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
    },
    customer: {
      name: 'Hoàng Minh Đức',
      phone: '0981.554.433',
      address: '254 Nguyễn Văn Linh, P. Thạc Gián, Q. Thanh Khê, Đà Nẵng',
      note: ''
    },
    shippingMethod: 'Giao Hỏa Tốc SPX 2H',
    paymentMethod: 'Ví MoMo (Đã thanh toán)',
    items: [
      {
        id: 'tz-fs-04',
        name: 'Tai nghe Bluetooth Apple AirPods Pro 2 2023 Type-C',
        variant: 'Hộp sạc Type-C MagSafe',
        price: 5390000,
        quantity: 1,
        image: 'images/sp4.jpg'
      },
      {
        id: 'tz-acc-08',
        name: 'Cáp sạc nhanh Anker PowerLine III Flow C to C 100W 1.8m',
        variant: 'Tím Pastel 1.8m',
        price: 280000,
        quantity: 1,
        image: 'images/sp15.jpg'
      }
    ],
    subtotal: 5670000,
    shippingFee: 0,
    discountAmount: 0,
    total: 5670000,
    checkpoints: [
      { time: '11:15 18/10/2026', text: 'Giao hàng thành công. Khách hàng đã kiểm tra và ký nhận bưu kiện.' },
      { time: '09:45 18/10/2026', text: 'Shipper Nguyễn Quang Hải đang giao hàng tại khu vực Thanh Khê, Đà Nẵng.' },
      { time: '08:00 18/10/2026', text: 'Đơn hàng đã đến kho giao hàng Đà Nẵng Hub.' },
      { time: '09:00 17/10/2026', text: 'Đơn hàng rời trung tâm khai thác SPX Miền Trung.' }
    ]
  },
  {
    id: 'SPX-661205',
    aliases: ['TZ-88214'],
    createdAt: '2026-10-16 11:20',
    status: 'Đã giao',
    etaSeconds: 0,
    etaText: '15:40 16-10-2026 (Giao thành công)',
    shippingCourier: 'Shopee Express (SPX Nhanh)',
    shippingNotification: '✅ Giao hàng thành công - Đơn hàng đã được hoàn tất và đánh giá 5 sao ⭐',
    shipper: {
      name: 'Lê Văn Hùng',
      phone: '0918.445.566',
      plate: '51A - 334.89',
      rating: '4.95 ⭐ (1,420 chuyến)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80'
    },
    customer: {
      name: 'Phạm Thúy Nga',
      phone: '0908.776.554',
      address: 'Số 12 Tôn Đức Thắng, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      note: 'Giao giờ hành chính lên tầng 8'
    },
    shippingMethod: 'Giao Tiêu Chuẩn SPX',
    paymentMethod: 'Thẻ tín dụng Visa/MasterCard',
    items: [
      {
        id: 'tz-fs-02',
        name: 'Samsung Galaxy S24 Ultra 12GB 256GB - Quyền Năng Galaxy AI',
        variant: '12GB/256GB, Xám Titan',
        price: 27990000,
        quantity: 1,
        image: 'images/sp2.jpg'
      }
    ],
    subtotal: 27990000,
    shippingFee: 0,
    discountAmount: 100000,
    total: 27890000,
    checkpoints: [
      { time: '15:40 16/10/2026', text: 'Giao hàng thành công. Khách hàng đã kiểm tra và nhận hàng.' },
      { time: '13:10 16/10/2026', text: 'Shipper Lê Văn Hùng đang đi giao tại khu vực Bến Nghé, Quận 1.' },
      { time: '11:20 16/10/2026', text: 'Đơn hàng đã được xác nhận và bàn giao cho đơn vị SPX Nhanh.' }
    ]
  },
  {
    id: 'SPX-442190',
    aliases: ['TZ-49021'],
    createdAt: '2026-10-14 17:30',
    status: 'Đã hủy',
    etaSeconds: 0,
    etaText: 'Đã hủy lúc 18:10 14-10-2026',
    shippingCourier: 'Shopee Express (SPX Speed)',
    shippingNotification: '❌ Đơn hàng đã được hủy thành công bởi Người mua (Lý do: Thay đổi địa chỉ nhận hàng)',
    shipper: {
      name: 'Chưa điều phối',
      phone: '---',
      plate: '---',
      rating: '---',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'
    },
    customer: {
      name: 'Võ Thanh Trúc',
      phone: '0943.221.100',
      address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, P. 22, Q. Bình Thạnh, TP. Hồ Chí Minh',
      note: 'Khách hàng đổi ý mua màu khác'
    },
    shippingMethod: 'Giao Tiêu Chuẩn 24H',
    paymentMethod: 'Thanh toán COD',
    items: [
      {
        id: 'tz-acc-04',
        name: 'Tai nghe chụp tai Sony WH-1000XM5 Hi-Res Wireless',
        variant: 'Đen Carbon, Chống ồn',
        price: 7490000,
        quantity: 1,
        image: 'images/sp8.jpg'
      }
    ],
    subtotal: 7490000,
    shippingFee: 30000,
    discountAmount: 0,
    total: 7520000,
    checkpoints: [
      { time: '18:10 14/10/2026', text: 'Đơn hàng đã hủy bởi người mua - Lý do: Thay đổi địa chỉ nhận hàng.' },
      { time: '17:30 14/10/2026', text: 'Khởi tạo đơn hàng trên hệ thống.' }
    ]
  }
];


// --- CATEGORY METADATA & NORMALIZATION HELPERS ---
const CATEGORY_NAMES = {
  phone: {
    title: 'Điện thoại & Tablet',
    icon: 'fa-solid fa-mobile-screen-button',
    desc: 'Tuyển chọn smartphone, iPhone, máy tính bảng hàng đầu thị trường'
  },
  laptop: {
    title: 'Laptop & Màn hình máy tính',
    icon: 'fa-solid fa-laptop',
    desc: 'Laptop đồ họa, gaming, văn phòng mỏng nhẹ và màn hình máy tính sắc nét'
  },
  audio: {
    title: 'Thiết bị Âm thanh (Tai nghe, Loa)',
    icon: 'fa-solid fa-headphones',
    desc: 'Tai nghe chống ồn ANC, tai nghe true wireless, loa bluetooth chất âm đỉnh cao'
  },
  watch: {
    title: 'Đồng hồ thông minh (Smartwatch)',
    icon: 'fa-solid fa-stopwatch',
    desc: 'Smartwatch thể thao, theo dõi sức khỏe, định vị GPS tần số kép'
  },
  accessory: {
    title: 'Phụ kiện sạc cáp, pin dự phòng',
    icon: 'fa-solid fa-bolt',
    desc: 'Củ sạc GaN, pin dự phòng dung lượng cao, cáp sạc nhanh, chuột và bàn phím'
  }
};

function normalizeCategoryKey(raw) {
  if (!raw) return null;
  const lower = raw.trim().toLowerCase();
  if (['phone', 'dien-thoai', 'điện thoại', 'dienthoai', 'tablet'].includes(lower)) return 'phone';
  if (['laptop', 'may-tinh-bang', 'may-tinh', 'máy tính'].includes(lower)) return 'laptop';
  if (['audio', 'am-thanh', 'âm thanh', 'tai-nghe', 'loa'].includes(lower)) return 'audio';
  if (['watch', 'dong-ho', 'đồng hồ', 'smartwatch'].includes(lower)) return 'watch';
  if (['accessory', 'phu-kien', 'phụ kiện', 'sac-cap', 'pin'].includes(lower)) return 'accessory';
  return lower;
}

// --- 2. LOCALSTORAGE MANAGEMENT ---
const Storage = {
  getProducts() {
    return TECHZONE_PRODUCTS;
  },

  getOrders() {
    const raw = localStorage.getItem('techzone_orders');
    if (!raw) {
      // Gán userEmail mặc định cho các đơn mẫu mock
      const mockWithEmail = INITIAL_MOCK_ORDERS.map(o => ({ ...o, userEmail: 'admin@gmail.com' }));
      localStorage.setItem('techzone_orders', JSON.stringify(mockWithEmail));
      return mockWithEmail;
    }
    try {
      const parsed = JSON.parse(raw);
      let updated = false;
      parsed.forEach(o => {
        if (!o.userEmail && (o.id.startsWith('SPX-') || o.customer?.name === 'Nguyễn Văn Minh' || o.customer?.name === 'Quản trị viên TechZone')) {
          o.userEmail = 'admin@gmail.com';
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem('techzone_orders', JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      return INITIAL_MOCK_ORDERS;
    }
  },

  saveOrders(orders) {
    localStorage.setItem('techzone_orders', JSON.stringify(orders));
  },

  findOrderById(id) {
    if (!id) return null;
    const orders = this.getOrders();
    const cleanId = id.trim().toUpperCase();
    return orders.find(o => 
      o.id.toUpperCase() === cleanId || 
      (o.aliases && o.aliases.some(a => a.toUpperCase() === cleanId))
    ) || null;
  },

  addOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);
    return order;
  },

  resetDemoOrders() {
    localStorage.setItem('techzone_orders', JSON.stringify(INITIAL_MOCK_ORDERS));
    return INITIAL_MOCK_ORDERS;
  },

  // --- QUẢN LÝ GIỎ HÀNG RIÊNG BIỆT THEO TỪNG TÀI KHOẢN (cart_[email]) ---
  getCartKey() {
    const user = Auth.getUser();
    if (!user || !user.email) return null;
    return 'cart_' + user.email.toLowerCase().trim();
  },

  getCart() {
    const key = this.getCartKey();
    if (!key) return [];
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },

  saveCart(cart) {
    const key = this.getCartKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(cart));
    this.updateCartBadge();
  },

  addToCart(product, quantity = 1) {
    const user = Auth.getUser();
    if (!user) {
      return false; // Tuyệt đối không thêm vào giỏ nếu chưa đăng nhập
    }
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity
      });
    }
    this.saveCart(cart);
    return true;
  },

  removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== productId);
    this.saveCart(cart);
    return cart;
  },

  updateQuantity(productId, delta) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        return this.removeFromCart(productId);
      }
    }
    this.saveCart(cart);
    return cart;
  },

  clearCart() {
    const key = this.getCartKey();
    if (key) {
      localStorage.removeItem(key);
    }
    this.updateCartBadge();
  },

  updateCartBadge() {
    const user = Auth.getUser();
    let totalCount = 0;
    if (user && user.email) {
      const cart = this.getCart();
      totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }
    const badges = document.querySelectorAll('.tz-cart-badge');
    badges.forEach(b => {
      b.textContent = totalCount;
    });
  }
};

// --- 2.1 VOUCHER SERVICE (CÁ NHÂN HÓA THEO TỪNG TÀI KHOẢN) ---
const VoucherService = {
  getUserVouchers(user) {
    if (!user) user = (typeof Auth !== 'undefined' ? Auth.getUser() : null);
    if (!user) return [];

    // Lấy danh sách voucher từ localStorage theo khóa: vouchers_${currentUser.email}
    const storageKey = `vouchers_${user.email || user.username || ''}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }

    // Nếu tài khoản chưa có voucher nào (mảng rỗng hoặc null): KHÔNG DÙNG SỐ ẢO
    return [];
  },

  generateVouchersForUser(user) {
    const rawName = (user.fullname || user.username || 'KHACH').trim();
    const isVipOrAdmin = user.username === 'admin' || user.email === 'admin@gmail.com' || (user.fullname && user.fullname.includes('Trần Hoàng Nam'));

    const now = new Date();
    const exp = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toLocaleDateString('vi-VN');

    return [
      {
        code: 'TECHZONE100',
        title: 'Mã Giảm Giá TechZone: Giảm 100.000đ cho đơn từ 500.000đ',
        category: 'discount',
        discountType: 'fixed',
        discountValue: 100000,
        minOrder: 500000,
        expiryDate: exp,
        isUsed: false,
        badgeColor: '#ef4444',
        badgeText: 'GIẢM 100K'
      },
      {
        code: 'FREESHIP30',
        title: 'Miễn Phí Vận Chuyển hỏa tốc toàn quốc (Tối đa 30.000đ)',
        category: 'freeship',
        discountType: 'fixed',
        discountValue: 30000,
        minOrder: 200000,
        expiryDate: exp,
        isUsed: false,
        badgeColor: '#10b981',
        badgeText: 'FREESHIP 30K'
      },
      {
        code: 'SMEMBERVIP',
        title: isVipOrAdmin ? 'Đặc Quyền VIP TechZone: Giảm 200.000đ cho đơn từ 2.000.000đ' : 'Đặc Quyền Smember: Giảm 150.000đ cho đơn từ 1.500.000đ',
        category: 'vip',
        discountType: 'fixed',
        discountValue: isVipOrAdmin ? 200000 : 150000,
        minOrder: isVipOrAdmin ? 2000000 : 1500000,
        expiryDate: exp,
        isUsed: false,
        badgeColor: '#8b5cf6',
        badgeText: 'VIP ONLY'
      },
      {
        code: 'FLASHSALE50',
        title: 'Flash Sale Công Nghệ: Giảm 50.000đ cho đơn từ 300.000đ',
        category: 'discount',
        discountType: 'fixed',
        discountValue: 50000,
        minOrder: 300000,
        expiryDate: exp,
        isUsed: false,
        badgeColor: '#f59e0b',
        badgeText: 'FLASH SALE'
      }
    ];
  },

  addVoucherToUser(voucher, user) {
    if (!user) user = (typeof Auth !== 'undefined' ? Auth.getUser() : null);
    if (!user) return { success: false, message: 'Vui lòng đăng nhập để lưu mã vào ví voucher!' };
    const vouchers = this.getUserVouchers(user);
    if (vouchers.some(v => v.code.toUpperCase() === voucher.code.toUpperCase())) {
      return { success: false, message: `Mã ${voucher.code} đã có sẵn trong ví voucher của bạn!` };
    }
    vouchers.unshift(voucher);
    const storageKey = `vouchers_${user.email || user.username || ''}`;
    localStorage.setItem(storageKey, JSON.stringify(vouchers));
    return { success: true, message: `Đã lưu thành công mã ${voucher.code} vào ví cá nhân!` };
  },

  markVoucherAsUsed(code, user, orderId) {
    if (!user) user = (typeof Auth !== 'undefined' ? Auth.getUser() : null);
    if (!user || !code) return;

    const vouchers = this.getUserVouchers(user);
    const target = vouchers.find(v => v.code.toUpperCase() === code.toUpperCase());
    if (target) {
      target.isUsed = true;
      target.usedInOrderId = orderId;
      target.usedAt = new Date().toISOString();
      const storageKey = `vouchers_${user.email || user.username || ''}`;
      localStorage.setItem(storageKey, JSON.stringify(vouchers));
    }
  }
};

// --- 2.2 WARRANTY SERVICE (TRA CỨU BẢO HÀNH THIẾT BỊ ĐÃ GIAO) ---
const WarrantyService = {
  getWarrantyInfo(order, item) {
    if (!order || !item) return null;

    const cleanId = (order.id || 'SPX').replace(/[^a-zA-Z0-9]/g, '');
    const cleanItemId = (item.id || 'sp1').replace(/[^a-zA-Z0-9]/g, '').slice(-2);
    // Serial/IMEI giả lập chuẩn VD: TZ-VN/A-992812
    const imei = `TZ-VN/A-${cleanId.slice(-4)}${cleanItemId || '12'}`;
    const serial = `SN-${cleanItemId || '01'}-${cleanId.slice(-6)}`;

    // Thời hạn bảo hành: 12 tháng (hoặc 24 tháng cho laptop, Apple)
    const isAppleOrLaptop = (item.name || '').includes('iPhone') || (item.name || '').includes('MacBook') || (item.name || '').includes('ASUS') || (item.name || '').includes('ROG');
    const warrantyMonths = isAppleOrLaptop ? 24 : 12;

    const orderDate = new Date(order.createdAt || Date.now());
    const expiryDate = new Date(orderDate);
    expiryDate.setMonth(expiryDate.getMonth() + warrantyMonths);

    const now = new Date();
    const diffTime = expiryDate - now;
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const isValid = daysRemaining > 0;

    return {
      orderId: order.id,
      customerName: order.customer?.name || 'Khách hàng TechZone',
      customerPhone: order.customer?.phone || '',
      item: item,
      imei: imei,
      serial: serial,
      warrantyMonths: warrantyMonths,
      startDate: orderDate.toLocaleDateString('vi-VN'),
      expiryDate: expiryDate.toLocaleDateString('vi-VN'),
      daysRemaining: daysRemaining,
      isValid: isValid,
      warrantyType: isAppleOrLaptop ? `Bảo Hành Chính Hãng Cao Cấp (${warrantyMonths} Tháng)` : `Bảo Hành Tiêu Chuẩn (${warrantyMonths} Tháng)`,
      statusText: isValid ? `Còn hạn bảo hành (còn ${daysRemaining} ngày)` : 'Hết hạn bảo hành'
    };
  },

  // Danh sách các sản phẩm ĐÃ GIAO THÀNH CÔNG của chính tài khoản đang đăng nhập
  getUserDeliveredWarranties(user) {
    if (!user) user = Auth.getUser();
    if (!user) return [];

    const allOrders = Storage.getOrders();
    const cEmail = (user.email || '').toLowerCase().trim();

    // Lọc đơn hàng của user và ĐÃ GIAO THÀNH CÔNG
    const userOrders = allOrders.filter(o => {
      const oEmail = (o.userEmail || o.customer?.email || '').toLowerCase().trim();
      const isUser = (cEmail && oEmail && cEmail === oEmail) || (user.username === 'admin' && (!o.userEmail || o.userEmail === 'admin@gmail.com'));
      const isDelivered = o.status === 'Đã giao' || o.status === 'Giao thành công';
      return isUser && isDelivered;
    });

    const warranties = [];
    userOrders.forEach(o => {
      if (o.items) {
        o.items.forEach(it => {
          warranties.push(this.getWarrantyInfo(o, it));
        });
      }
    });

    return warranties;
  },

  // Tra cứu theo SĐT, IMEI hoặc Mã đơn hàng (chỉ tìm trong đơn đã giao thành công)
  lookup(keyword, user) {
    if (!keyword || !keyword.trim()) return [];
    const q = keyword.trim().toLowerCase();
    const allOrders = Storage.getOrders();

    const results = [];
    allOrders.forEach(o => {
      if (o.status === 'Đã giao' || o.status === 'Giao thành công') {
        const orderMatch = o.id.toLowerCase().includes(q) || (o.customer?.phone && o.customer.phone.includes(q));
        if (o.items) {
          o.items.forEach(it => {
            const w = this.getWarrantyInfo(o, it);
            if (orderMatch || w.imei.toLowerCase().includes(q) || it.name.toLowerCase().includes(q)) {
              results.push(w);
            }
          });
        }
      }
    });
    return results;
  }
};

// --- 3. UI UTILITIES & TOAST NOTIFICATION ---
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function showToast(message, type = 'info', title = null) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Chống kích hoạt lặp lại cùng một thông báo khi đang hiển thị
  const activeToasts = container.querySelectorAll('.toast');
  for (const item of activeToasts) {
    const msgEl = item.querySelector('.toast-msg');
    if (msgEl && (msgEl.innerHTML === message || msgEl.textContent === message)) {
      return;
    }
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-solid fa-circle-info';
  let defaultTitle = 'Thông báo';
  if (type === 'success') {
    icon = 'fa-solid fa-circle-check';
    defaultTitle = 'Thành công!';
  } else if (type === 'error') {
    icon = 'fa-solid fa-circle-exclamation';
    defaultTitle = 'Có lỗi xảy ra!';
  } else if (type === 'warning') {
    icon = 'fa-solid fa-triangle-exclamation';
    defaultTitle = 'Lưu ý!';
  }

  const displayTitle = title || defaultTitle;

  toast.innerHTML = `
    <div class="toast-icon">
      <i class="${icon}"></i>
    </div>
    <div class="toast-body">
      <div class="toast-title">${displayTitle}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button type="button" class="toast-close-btn" title="Đóng">&times;</button>
  `;

  const closeBtn = toast.querySelector('.toast-close-btn');
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(110%)';
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 250);
  });

  container.appendChild(toast);

  // Tự động ẩn và xóa sau 3 giây
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(110%)';
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 300);
    }
  }, 3000);
}

// --- 4. RENDER TECHZONE PRODUCT CARD ---
function renderTechZoneProductCard(prod, isFlashSale = false) {
  const discountBadge = (prod.discountPercent && prod.discountPercent > 0) ? `<span class="tz-badge-discount"><i class="fa-solid fa-bolt"></i> Giảm ${prod.discountPercent}%</span>` : '';
  const installmentBadge = (prod.isInstallment !== false) ? `<span class="tz-badge-installment">Trả góp 0%</span>` : '';

  const specPills = (prod.specs || []).slice(0, 3).map(s => `<span class="tz-spec-item">${s}</span>`).join('');

  let progressHtml = '';
  if (isFlashSale) {
    const sold = prod.soldCount || 88;
    const total = prod.totalStock || 100;
    const pct = Math.min(100, Math.round((sold / total) * 100));
    progressHtml = `
      <div class="tz-sold-bar">
        <div class="fill" style="width: ${pct}%;"></div>
        <div class="label">
          <i class="fa-solid fa-fire"></i> Đã bán ${sold}/${total} suất
        </div>
      </div>
    `;
  }

  const priceVal = prod.price || 0;
  const originalPriceVal = prod.originalPrice || prod.oldPrice || 0;

  return `
    <div class="product-card tz-product-card ${isFlashSale ? 'tz-flashsale-item' : ''}" data-id="${prod.id}">
      <div class="tz-card-badges">
        ${discountBadge}
        ${installmentBadge}
      </div>

      <a href="product-detail.html?id=${prod.id}" class="product-img tz-card-thumb product-card-img-wrap product-img-box" title="Xem chi tiết ${prod.name}">
        <img src="${prod.image}" alt="${prod.name}" loading="lazy">
      </a>

      <a href="product-detail.html?id=${prod.id}" class="tz-card-title-link" title="Xem chi tiết ${prod.name}">
        <h4 class="product-title tz-product-title">${prod.name}</h4>
      </a>

      <div class="tz-spec-pills">
        ${specPills}
      </div>

      <div class="tz-price-row">
        <span class="price-current tz-price-current ${isFlashSale ? 'flash-price' : ''}">${formatVND(priceVal)}</span>
        ${originalPriceVal > priceVal ? `<span class="price-old tz-price-old">${formatVND(originalPriceVal)}</span>` : ''}
      </div>

      ${progressHtml}

      <div class="card-actions card-action-btns tz-card-actions tz-single-action-row">
        <button type="button" class="btn-card-add btn-card-add-primary" data-id="${prod.id}">
          <i class="fa-solid fa-cart-shopping"></i> Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  `;
}

function bindProductActions(container) {
  const addBtns = container.querySelectorAll('.btn-card-add');

  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const currentUser = Auth.getUser();
      if (!currentUser) {
        showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng và mua sắm!', 'warning', 'Yêu cầu đăng nhập');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1200);
        return;
      }
      const pId = btn.dataset.id;
      const prod = Storage.getProducts().find(p => p.id === pId);
      if (prod) {
        Storage.addToCart(prod, 1);
        showToast(`Đã thêm <strong>${prod.name}</strong> vào giỏ hàng TechZone!`, 'success', 'Thành công');
      }
    });
  });
}

// --- 5. PAGE LOGIC: HOMEPAGE (index.html) ---
function initHomePage() {
  // 1. Hero Main Slider
  initMainSlider();

  // 2. Flash Sale Countdown Timer (08:45:12)
  initFlashSaleCountdown();

  // 3. Render Flash Sale Grid
  const flashSaleContainer = document.getElementById('flashsale-cards-container');
  if (flashSaleContainer) {
    const flashProducts = Storage.getProducts().filter(p => p.isFlashSale);
    flashSaleContainer.innerHTML = flashProducts.map(p => renderTechZoneProductCard(p, true)).join('');
    bindProductActions(flashSaleContainer);
  }

  // 4. Render Block 1: Điện Thoại Nổi Bật
  const phoneGrid = document.getElementById('phones-grid-container');
  if (phoneGrid) {
    const phones = Storage.getProducts().filter(p => p.category === 'phone');
    phoneGrid.innerHTML = phones.map(p => renderTechZoneProductCard(p, false)).join('');
    bindProductActions(phoneGrid);
  }

  // 5. Render Block 2: Laptop & Máy Tính Bảng
  const laptopGrid = document.getElementById('laptops-grid-container');
  if (laptopGrid) {
    const laptops = Storage.getProducts().filter(p => p.category === 'laptop');
    laptopGrid.innerHTML = laptops.map(p => renderTechZoneProductCard(p, false)).join('');
    bindProductActions(laptopGrid);
  }

  // 6. Render Block 3: Phụ Kiện Giá Sốc (Phụ kiện, Âm thanh, Smartwatch)
  const accGrid = document.getElementById('accessories-grid-container');
  if (accGrid) {
    const accs = Storage.getProducts().filter(p => ['accessory', 'audio', 'watch'].includes(p.category));
    accGrid.innerHTML = accs.map(p => renderTechZoneProductCard(p, false)).join('');
    bindProductActions(accGrid);
  }

  // 7. Brand Tabs inside sections
  initBrandTabsFiltering();

  // 8. Order Tracking Widget & Header Search
  initSmartOrderBanner();
}

// Main Interactive Slider
function initMainSlider() {
  const slides = document.querySelectorAll('.tz-slide');
  const tabs = document.querySelectorAll('.tz-slide-tab');
  const prevBtn = document.querySelector('.tz-slider-btn.prev');
  const nextBtn = document.querySelector('.tz-slider-btn.next');

  if (slides.length === 0) return;

  let currentSlide = 0;
  let timer = null;

  function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    if (tabs[currentSlide]) tabs[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (tabs[currentSlide]) tabs[currentSlide].classList.add('active');
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 4500);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startAutoplay();
    });
  }

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      showSlide(idx);
      startAutoplay();
    });
  });

  startAutoplay();
}

// Flash Sale Countdown Timer dựa trên mốc giờ thực tế: 00:00, 06:00, 09:00, 12:00, 17:00, 21:00
function initFlashSaleCountdown() {
  const hoursElem = document.getElementById('timer-hours');
  const minsElem = document.getElementById('timer-mins');
  const secsElem = document.getElementById('timer-secs');
  const badgeElem = document.getElementById('flashsale-status-badge');
  const labelElem = document.getElementById('flashsale-timer-label');

  if (!hoursElem || !minsElem || !secsElem) return;

  // Các mốc giờ cố định trong ngày (mỗi phiên kéo dài 60 phút = 1 tiếng)
  const FLASH_SALE_HOURS = [0, 6, 9, 12, 17, 21];

  function updateTimer() {
    const now = new Date();
    const nowMs = now.getTime();
    const pad = n => String(n).padStart(2, '0');

    // 1. Kiểm tra xem hiện tại có đang trong phiên nào không
    let activeSession = null;

    for (const h of FLASH_SALE_HOURS) {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, 0, 0, 0);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // Kéo dài đúng 60 phút

      if (nowMs >= start.getTime() && nowMs < end.getTime()) {
        activeSession = { start, end, hour: h };
        break;
      }
    }

    if (activeSession) {
      // ĐANG TRONG PHIÊN FLASH SALE
      const diffMs = Math.max(0, activeSession.end.getTime() - nowMs);
      const totalSec = Math.floor(diffMs / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      hoursElem.textContent = pad(h);
      minsElem.textContent = pad(m);
      secsElem.textContent = pad(s);

      if (badgeElem) {
        badgeElem.textContent = '⚡ ĐANG DIỄN RA';
        badgeElem.className = 'flashsale-badge-live';
      }
      if (labelElem) {
        labelElem.textContent = 'KẾT THÚC TRONG:';
      }
    } else {
      // NGOÀI PHIÊN FLASH SALE -> TÌM PHIÊN SẮP TỚI
      let nextStart = null;
      let nextH = null;

      // Tìm phiên tiếp theo trong ngày hôm nay
      for (const h of FLASH_SALE_HOURS) {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, 0, 0, 0);
        if (start.getTime() > nowMs) {
          nextStart = start;
          nextH = h;
          break;
        }
      }

      // Nếu hôm nay đã qua hết các phiên (sau 22:00), phiên tiếp theo là 00:00 ngày mai
      if (!nextStart) {
        nextStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, FLASH_SALE_HOURS[0], 0, 0, 0);
        nextH = FLASH_SALE_HOURS[0];
      }

      const diffMs = Math.max(0, nextStart.getTime() - nowMs);
      const totalSec = Math.floor(diffMs / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      hoursElem.textContent = pad(h);
      minsElem.textContent = pad(m);
      secsElem.textContent = pad(s);

      const hourFormatted = `${pad(nextH)}:00`;
      if (badgeElem) {
        badgeElem.textContent = `⚡ SẮP DIỄN RA (Phiên ${hourFormatted})`;
        badgeElem.className = 'flashsale-badge-upcoming';
      }
      if (labelElem) {
        labelElem.textContent = 'BẮT ĐẦU TRONG:';
      }
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// Brand Tabs filtering (Luôn duy trì 10 sản phẩm 2 hàng x 5 cột không bị hổng lưới)
function initBrandTabsFiltering() {
  const tabPills = document.querySelectorAll('.tz-tab-pill');
  tabPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const parentSection = pill.closest('.tz-category-section');
      if (!parentSection) return;

      const group = parentSection.querySelectorAll('.tz-tab-pill');
      group.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const brand = pill.dataset.brand;
      const category = pill.dataset.category;
      const grid = parentSection.querySelector('.section-products-grid') || parentSection.querySelector('.products-grid');

      if (!grid) return;

      let allCategoryItems = Storage.getProducts().filter(p => {
        if (category === 'Laptop' || category === 'laptop') return p.category === 'laptop' && !p.isFlashSale;
        if (category === 'Điện thoại' || category === 'phone') return p.category === 'phone' && !p.isFlashSale;
        if (category === 'Phụ kiện' || category === 'accessory') return ['accessory', 'audio', 'watch'].includes(p.category) && !p.isFlashSale;
        return (p.category === category || p.category === normalizeCategoryKey(category)) && !p.isFlashSale;
      });

      let displayItems = [];
      if (brand && brand !== 'all') {
        const brandMatches = allCategoryItems.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
        const otherItems = allCategoryItems.filter(p => p.brand.toLowerCase() !== brand.toLowerCase());
        displayItems = [...brandMatches, ...otherItems].slice(0, 10);
      } else {
        displayItems = allCategoryItems.slice(0, 10);
      }

      grid.innerHTML = displayItems.map(p => renderTechZoneProductCard(p, false)).join('');
      bindProductActions(grid);
    });
  });
}

// 8. Smart Order Tracking Banner on Homepage (Đơn hàng đang giao hỏa tốc - Live Tracking Widget)
function initSmartOrderBanner() {
  const container = document.getElementById('liveTrackingWidget') || document.getElementById('home-smart-order-banner');
  if (!container) return;

  // 1. Kiểm tra trạng thái đăng nhập
  const currentUser = Auth.getUser();
  if (!currentUser || !currentUser.email) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  // 2. Lấy thông tin orders và lọc đơn hàng của chính user này
  const cEmail = (currentUser.email || '').toLowerCase().trim();
  const allOrders = Storage.getOrders();
  const userOrders = allOrders.filter(o => {
    const oEmail = (o.userEmail || o.customer?.email || '').toLowerCase().trim();
    if (cEmail && oEmail && cEmail === oEmail) return true;
    if (currentUser.username === 'admin' && (o.userEmail === 'admin@gmail.com' || o.id === 'SPX-892341' || !o.userEmail)) {
      return true;
    }
    return false;
  });

  // 3. Tìm xem user này có đơn hàng đang hoạt động không (Ưu tiên Đang giao/Đang vận chuyển, sau đó là Chờ xác nhận/Đang đóng gói)
  const inTransitOrder = userOrders.find(o => o.status === 'Đang giao' || o.status === 'Đang vận chuyển');
  const packingOrder = userOrders.find(o => o.status === 'Chờ xác nhận' || o.status === 'Đang đóng gói' || o.status === 'Đã xác nhận');
  const activeOrder = inTransitOrder || packingOrder;

  // NẾU CÓ: Render thông tin đơn hàng thật của chính user đó và hiển thị widget
  if (activeOrder) {
    const firstItem = activeOrder.items && activeOrder.items.length > 0 ? activeOrder.items[0] : null;
    const itemName = firstItem ? firstItem.name : 'Thiết bị công nghệ TechZone';
    const itemImg = firstItem ? firstItem.image : 'images/sp1.jpg';
    const otherCount = activeOrder.items && activeOrder.items.length > 1 ? activeOrder.items.length - 1 : 0;
    const isTransit = (activeOrder.status === 'Đang giao' || activeOrder.status === 'Đang vận chuyển');

    const shipper = activeOrder.shipper || {
      name: 'Trần Hoàng Nam',
      phone: '0988.223.344',
      plate: '29B1 - 892.45'
    };
    const courierName = activeOrder.shippingCourier || 'Shopee Express (SPX Speed)';
    const etaText = activeOrder.etaText || 'Dự kiến giao trong 2 giờ tới';

    // Conditional description: TUYỆT ĐỐI KHÔNG hiện thông tin shipper khi đang đóng gói/chờ xác nhận!
    const descHtml = isTransit
      ? `<i class="fa-solid fa-location-dot" style="color: #ef4444;"></i> Shipper <strong>${shipper.name}</strong> (${shipper.phone}) đang giao hàng đến bạn. ${etaText}`
      : `<i class="fa-solid fa-boxes-packing" style="color: #16a34a;"></i> Kiện hàng đang được nhân viên kho kiểm tra và đóng gói cẩn thận. Dự kiến bàn giao cho tài xế trong vài phút tới.`;

    const tagTitle = isTransit ? 'ĐƠN HÀNG ĐANG GIAO HỎA TỐC' : 'ĐANG CHUẨN BỊ & ĐÓNG GÓI TẠI KHO';
    const pulseDotColor = isTransit ? '#ef4444' : '#16a34a';

    container.innerHTML = `
      <div class="tz-smart-banner-card active-delivery" onclick="window.location.href='tracking-detail.html?id=${encodeURIComponent(activeOrder.id)}'" title="Nhấp vào để xem lộ trình giao nhận thời gian thực">
        <div class="smart-banner-left">
          <div class="smart-banner-thumb-col">
            <div class="smart-banner-thumb-wrap">
              <img src="${itemImg}" alt="${itemName}" class="smart-banner-thumb">
            </div>
            <span class="smart-banner-pulse-badge"><i class="fa-solid fa-bolt"></i> SPX</span>
          </div>
          <div class="smart-banner-info">
            <div class="smart-banner-status-tag">
              <span class="live-pulse-dot" style="background: ${pulseDotColor};"></span>
              <strong>${tagTitle}</strong>
              <span class="smart-code-chip">#${activeOrder.id}</span>
            </div>
            <h4 class="smart-banner-title">
              ${itemName} ${otherCount > 0 ? `<span class="smart-other-count">+${otherCount} sản phẩm khác</span>` : ''}
            </h4>
            <p class="smart-banner-desc">
              ${descHtml}
            </p>
          </div>
        </div>
        <div class="smart-banner-right" onclick="event.stopPropagation()">
          <a href="tracking-detail.html?id=${encodeURIComponent(activeOrder.id)}" class="btn-smart-track-main">
            <i class="fa-solid fa-route"></i> Xem lộ trình giao nhận <i class="fa-solid fa-arrow-right"></i>
          </a>
          <a href="history.html" class="btn-smart-history-link">
            <i class="fa-solid fa-receipt"></i> Tất cả đơn mua (${userOrders.length})
          </a>
        </div>
      </div>
    `;
    container.style.display = 'block';
  } else {
    // NẾU KHÔNG CÓ (hoặc là tài khoản mới/chưa đăng nhập): Tuyệt đối ẨN HOÀN TOÀN khối này, không hiển thị bất kỳ thông tin nào gây hiểu lầm
    container.style.display = 'none';
    container.innerHTML = '';
  }
}

// Alias cho widget theo dõi trực tiếp
const initLiveTrackingWidget = initSmartOrderBanner;

function handleTrackingSearch(orderCode) {
  if (!orderCode || !orderCode.trim()) {
    showToast('Vui lòng nhập mã đơn hàng để kiểm tra tiến trình!', 'warning');
    return;
  }
  const clean = orderCode.trim().toUpperCase();
  const order = Storage.findOrderById(clean);
  if (order) {
    showToast(`Đã tìm thấy đơn hàng ${order.id}! Đang mở lộ trình giao nhận Shopee Express...`, 'success');
    setTimeout(() => {
      window.location.href = `tracking-detail.html?id=${encodeURIComponent(order.id)}`;
    }, 500);
  } else {
    showToast(`Không tìm thấy mã "${orderCode}". Chuyển tiếp tới danh sách đơn mua...`, 'info');
    setTimeout(() => {
      window.location.href = 'history.html';
    }, 600);
  }
}

// --- 6. PAGE LOGIC: PRODUCTS CATALOG (products.html) ---
function initProductsPage() {
  const grid = document.getElementById('catalog-products-grid');
  const searchInput = document.getElementById('catalog-search-field');
  const sortSelect = document.getElementById('catalog-sort-dropdown');
  const brandButtons = document.querySelectorAll('.tz-filter-chip');
  const catalogTitle = document.getElementById('catalog-title');
  const catalogDesc = document.getElementById('catalog-desc');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');
  const filterIndicator = document.getElementById('catalog-filter-indicator');
  const activeCategoryTag = document.getElementById('active-category-tag');
  const btnResetFilter = document.getElementById('btn-reset-catalog-filter');

  if (!grid) return;

  // 1. Đọc tham số URL: category, brand, q & filter (outlet/tradein)
  const urlParams = new URLSearchParams(window.location.search);
  const rawCatParam = urlParams.get('category');
  let currentCategory = rawCatParam ? (normalizeCategoryKey(rawCatParam) || 'all') : 'all';
  let currentBrand = urlParams.get('brand') || 'all';
  let currentSearch = urlParams.get('q') || '';
  let currentSort = 'default';

  const filterParam = urlParams.get('filter');
  if (filterParam === 'outlet' && !currentSearch) {
    currentSearch = 'outlet';
  } else if (filterParam === 'tradein' && !currentSearch) {
    currentSearch = 'thu cũ';
  }

  if (searchInput && currentSearch) {
    searchInput.value = currentSearch;
  }

  function filterAndDisplay() {
    const products = Storage.getProducts();
    let items = [...products];

    // 2. Lọc sản phẩm theo Category (BẮT BUỘC chỉ hiển thị sản phẩm thuộc đúng danh mục đó)
    if (currentCategory && currentCategory !== 'all') {
      const selectedCategory = currentCategory;
      items = products.filter(item => item.category === selectedCategory);
    }

    // Lọc theo Brand chip nếu người dùng chọn
    if (currentBrand && currentBrand !== 'all') {
      items = items.filter(p => (p.brand || '').toLowerCase() === currentBrand.toLowerCase());
    }

    // Lọc theo Search keyword nếu có
    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase().trim();
      items = items.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.specs && p.specs.some(s => s.toLowerCase().includes(q))) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sắp xếp
    if (currentSort === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'discount-desc') {
      items.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    }

    // Cập nhật tiêu đề danh mục: "Danh mục: [Tên danh mục] (X sản phẩm)"
    updateCatalogHeaders(items.length);

    // Render CHỈ danh sách sản phẩm đã lọc ra giao diện
    if (items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3.5rem 1rem; background: white; border-radius: 14px; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
          <i class="fa-solid fa-box-open" style="font-size: 3.5rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
          <h4 style="color: #64748b; font-weight: 800; font-size: 1.15rem;">Không tìm thấy thiết bị nào phù hợp</h4>
          <p style="color: #94a3b8; font-size: 0.85rem; margin: 0.4rem auto 1.25rem; max-width: 420px;">
            Không có sản phẩm nào thuộc tiêu chí hiện tại. Bạn có thể chọn danh mục khác hoặc bấm xem tất cả sản phẩm.
          </p>
          <button type="button" class="btn-tz-primary" id="btn-empty-reset" style="padding: 0.55rem 1.35rem; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.5rem; margin: 0 auto; cursor: pointer;">
            <i class="fa-solid fa-rotate-left"></i> Xem tất cả sản phẩm
          </button>
        </div>
      `;
      const emptyReset = document.getElementById('btn-empty-reset');
      if (emptyReset) {
        emptyReset.addEventListener('click', () => {
          window.applyCategoryFilter('all', true);
        });
      }
      return;
    }

    grid.innerHTML = items.map(p => renderTechZoneProductCard(p, false)).join('');
    bindProductActions(grid);
  }

  function updateCatalogHeaders(count) {
    const info = CATEGORY_NAMES[currentCategory];
    if (currentCategory && currentCategory !== 'all' && info) {
      if (catalogTitle) {
        catalogTitle.textContent = `Danh mục: ${info.title} (${count} sản phẩm)`;
      }
      if (catalogDesc) {
        catalogDesc.textContent = info.desc;
      }
      if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = info.title;
      }
      if (filterIndicator) {
        filterIndicator.style.display = 'flex';
      }
      if (activeCategoryTag) {
        activeCategoryTag.innerHTML = `<i class="${info.icon}"></i> ${info.title} (${count})`;
      }
      document.title = `${info.title} (${count} sản phẩm) - TechZone`;
    } else {
      if (catalogTitle) {
        catalogTitle.textContent = 'TẤT CẢ THIẾT BỊ CÔNG NGHỆ TECHZONE';
      }
      if (catalogDesc) {
        catalogDesc.textContent = `Hàng chính hãng phân phối ủy quyền, hiển thị ${count} sản phẩm bảo hành đổi mới 30 ngày kèm giao hỏa tốc 2 giờ`;
      }
      if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = 'Danh mục thiết bị công nghệ';
      }
      if (filterIndicator) {
        filterIndicator.style.display = 'none';
      }
      document.title = 'Danh mục thiết bị công nghệ - TechZone';
    }
  }

  // Hàm lọc danh mục toàn cục dùng cho Menu Danh mục & Nút Bỏ lọc
  window.applyCategoryFilter = function(categoryKey, updateUrl = true) {
    const normalized = normalizeCategoryKey(categoryKey) || 'all';
    currentCategory = normalized;
    currentBrand = 'all'; // Reset chip thương hiệu khi đổi danh mục
    brandButtons.forEach(b => {
      if (b.dataset.filter === 'all') b.classList.add('active');
      else b.classList.remove('active');
    });

    if (updateUrl) {
      const newUrl = normalized === 'all' ? 'products.html' : `products.html?category=${encodeURIComponent(normalized)}`;
      window.history.pushState({ category: normalized }, '', newUrl);
    }

    filterAndDisplay();

    // Cuộn mượt lên đầu danh sách sản phẩm
    const mainSection = document.querySelector('.main-content');
    if (mainSection) {
      mainSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (normalized !== 'all' && CATEGORY_NAMES[normalized]) {
      showToast(`Đang hiển thị danh mục: <strong>${CATEGORY_NAMES[normalized].title}</strong>`, 'info');
    }
  };

  // Nút "Xem tất cả sản phẩm" để bỏ lọc
  if (btnResetFilter) {
    btnResetFilter.addEventListener('click', () => {
      window.applyCategoryFilter('all', true);
    });
  }

  // Brand Chips
  brandButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      brandButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBrand = btn.dataset.filter || 'all';
      filterAndDisplay();
    });
  });

  // Tìm kiếm theo từ khóa
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      filterAndDisplay();
    });
  }

  // Sắp xếp giá / % giảm giá
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      filterAndDisplay();
    });
  }

  // Hỗ trợ nút Back / Forward trên trình duyệt (Popstate)
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    window.applyCategoryFilter(cat || 'all', false);
  });

  // Thực thi hiển thị lần đầu
  filterAndDisplay();
}

// --- 7. PAGE LOGIC: CHECKOUT & CART (checkout.html) ---
function initCheckoutPage() {
  // 1. Kiểm tra trạng thái đăng nhập (Auth Guard)
  const currentUser = Auth.getUser();
  if (!currentUser) {
    sessionStorage.setItem('techzone_toast_flash', JSON.stringify({
      title: 'Yêu cầu đăng nhập',
      message: 'Vui lòng đăng nhập để xem giỏ hàng và thanh toán!',
      type: 'warning'
    }));
    window.location.href = 'login.html';
    return;
  }

  const cartListWrap = document.getElementById('checkout-items-list');
  const subtotalElem = document.getElementById('checkout-subtotal-val');
  const discountElem = document.getElementById('checkout-discount-val');
  const shippingElem = document.getElementById('checkout-shipping-val');
  const totalElem = document.getElementById('checkout-final-val');
  const emptyState = document.getElementById('checkout-empty-state');
  const checkoutForm = document.getElementById('tz-checkout-form');
  const voucherForm = document.getElementById('voucher-form');
  const voucherInput = document.getElementById('voucher-code');

  if (!cartListWrap) return;

  // 2. Tự động điền thông tin người nhận hàng từ Sổ địa chỉ / currentUser
  const custNameInput = document.getElementById('cust-name');
  const custPhoneInput = document.getElementById('cust-phone');
  const custCityInput = document.getElementById('cust-city');
  const custAddressInput = document.getElementById('cust-address');

  // Lấy địa chỉ mặc định từ Sổ địa chỉ
  const defaultAddr = Auth.getDefaultAddress(currentUser);

  function applyAddressToCheckoutForm(addr) {
    if (!addr) return;
    if (custNameInput) custNameInput.value = addr.recipientName || '';
    if (custPhoneInput) custPhoneInput.value = addr.phone || '';
    if (custCityInput && addr.city) custCityInput.value = addr.city;
    if (custAddressInput) custAddressInput.value = addr.detailAddress || '';

    const activeSummary = document.getElementById('active-address-summary');
    if (activeSummary) {
      const isDef = addr.isDefault;
      activeSummary.innerHTML = `
        <div class="active-addr-box">
          <div class="active-addr-top-row">
            <div class="active-addr-badge-wrap">
              <span class="active-addr-name">${addr.recipientName}</span>
              ${isDef ? '<span class="active-addr-badge-default"><i class="fa-solid fa-star"></i> Mặc định</span>' : '<span class="active-addr-badge-selected"><i class="fa-solid fa-check"></i> Đang chọn</span>'}
            </div>
            <button type="button" class="btn-change-addr-compact" id="btn-change-addr-link">
              <span>Đổi địa chỉ</span> <i class="fa-solid fa-angle-right"></i>
            </button>
          </div>
          <div class="active-addr-bottom-row">
            <span class="active-addr-phone"><i class="fa-solid fa-phone"></i> (+84) ${addr.phone}</span>
            <span class="active-addr-sep">•</span>
            <span class="active-addr-detail">${addr.detailAddress}, ${addr.city}</span>
          </div>
        </div>
      `;
      activeSummary.style.display = 'block';
      const changeBtn = activeSummary.querySelector('#btn-change-addr-link');
      if (changeBtn) changeBtn.onclick = () => openAddressBookModal();
    }
  }

  if (defaultAddr) {
    applyAddressToCheckoutForm(defaultAddr);
  } else {
    if (custNameInput && !custNameInput.value && currentUser.fullname) custNameInput.value = currentUser.fullname;
    if (custPhoneInput && !custPhoneInput.value && currentUser.phone) custPhoneInput.value = currentUser.phone;
    if (custCityInput && currentUser.city) custCityInput.value = currentUser.city;
    if (custAddressInput && !custAddressInput.value && currentUser.addressDetail) custAddressInput.value = currentUser.addressDetail;
  }

  // --- SỔ ĐỊA CHỈ NHẬN HÀNG (ADDRESS BOOK MODAL LOGIC) ---
  const addrModal = document.getElementById('tz-address-modal');
  const openAddrModalBtn = document.getElementById('btn-open-address-modal');
  const closeAddrModalBtn = document.getElementById('btn-close-address-modal');
  const countBadge = document.getElementById('address-count-badge');
  const addrListContainer = document.getElementById('address-book-list');
  const toggleAddFormBtn = document.getElementById('btn-toggle-add-addr-form');
  const addFormBox = document.getElementById('add-address-form-box');
  const cancelAddBtn = document.getElementById('btn-cancel-add-addr');
  const saveNewAddrBtn = document.getElementById('btn-save-new-addr');

  function updateAddressBadge() {
    const addrs = Auth.getUserAddresses(Auth.getUser());
    if (countBadge) countBadge.textContent = addrs.length;
  }
  updateAddressBadge();

  function renderAddressBookList() {
    const user = Auth.getUser();
    const addrs = Auth.getUserAddresses(user);
    updateAddressBadge();
    if (!addrListContainer) return;

    if (addrs.length === 0) {
      addrListContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: #64748b;">
          <i class="fa-solid fa-map-location-dot" style="font-size: 2.5rem; color: #cbd5e1; margin-bottom: 8px;"></i>
          <p>Chưa có địa chỉ nào trong sổ. Hãy thêm địa chỉ mới bên dưới!</p>
        </div>
      `;
      return;
    }

    addrListContainer.innerHTML = addrs.map(addr => `
      <div class="address-book-card ${addr.isDefault ? 'selected' : ''}" data-id="${addr.id}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <div>
            <strong style="color: #1e293b; font-size: 0.95rem;">${addr.recipientName}</strong>
            <span style="color: #64748b; font-size: 0.88rem; margin-left: 8px;">(+84) ${addr.phone}</span>
            ${addr.isDefault ? '<span class="badge-addr-default" style="margin-left: 8px;"><i class="fa-solid fa-circle-check"></i> Mặc định</span>' : ''}
          </div>
        </div>
        <div style="font-size: 0.86rem; color: #475569; margin-bottom: 10px; line-height: 1.45;">
          ${addr.detailAddress}, <strong>${addr.city}</strong>
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end; align-items: center; border-top: 1px dashed #f1f5f9; padding-top: 8px;">
          ${!addr.isDefault ? `
            <button type="button" class="btn-shopee-secondary btn-set-default-addr" data-id="${addr.id}" style="padding: 4px 10px; font-size: 0.78rem;">
              Đặt làm mặc định
            </button>
          ` : ''}
          <button type="button" class="btn-shopee-primary btn-use-addr" data-id="${addr.id}" style="padding: 4px 14px; font-size: 0.78rem;">
            <i class="fa-solid fa-check"></i> Giao đến địa chỉ này
          </button>
        </div>
      </div>
    `).join('');

    addrListContainer.querySelectorAll('.btn-use-addr').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const target = addrs.find(a => a.id === id);
        if (target) {
          applyAddressToCheckoutForm(target);
          showToast(`Đã chọn địa chỉ: <strong>${target.recipientName}</strong> (${target.city})`, 'success');
          closeAddressBookModal();
        }
      };
    });

    addrListContainer.querySelectorAll('.btn-set-default-addr').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        Auth.setDefaultAddress(id);
        const target = Auth.getUserAddresses().find(a => a.id === id);
        if (target) applyAddressToCheckoutForm(target);
        showToast('Đã thiết lập địa chỉ mặc định mới!', 'success');
        renderAddressBookList();
      };
    });
  }

  function openAddressBookModal() {
    renderAddressBookList();
    if (addrModal) addrModal.classList.add('active');
  }

  function closeAddressBookModal() {
    if (addrModal) addrModal.classList.remove('active');
    if (addFormBox) addFormBox.style.display = 'none';
  }

  if (openAddrModalBtn) openAddrModalBtn.onclick = openAddressBookModal;
  if (closeAddrModalBtn) closeAddrModalBtn.onclick = closeAddressBookModal;
  if (addrModal) {
    addrModal.onclick = (e) => {
      if (e.target === addrModal) closeAddressBookModal();
    };
  }

  if (toggleAddFormBtn && addFormBox) {
    toggleAddFormBtn.onclick = () => {
      addFormBox.style.display = addFormBox.style.display === 'none' ? 'block' : 'none';
      if (addFormBox.style.display === 'block') {
        document.getElementById('new-addr-name')?.focus();
      }
    };
  }

  if (cancelAddBtn && addFormBox) {
    cancelAddBtn.onclick = () => {
      addFormBox.style.display = 'none';
    };
  }

  if (saveNewAddrBtn) {
    saveNewAddrBtn.onclick = () => {
      const name = document.getElementById('new-addr-name')?.value.trim();
      const phone = document.getElementById('new-addr-phone')?.value.trim();
      const city = document.getElementById('new-addr-city')?.value;
      const detail = document.getElementById('new-addr-detail')?.value.trim();
      const isDef = document.getElementById('new-addr-default')?.checked || false;

      if (!name || !phone || !detail) {
        showToast('Vui lòng điền đủ Họ tên, Số điện thoại và Địa chỉ chi tiết!', 'warning');
        return;
      }

      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(phone)) {
        showToast('Số điện thoại không hợp lệ!', 'error');
        return;
      }

      const newAddr = Auth.addAddress({
        recipientName: name,
        phone: phone,
        city: city,
        detailAddress: detail,
        isDefault: isDef
      });

      showToast('Đã lưu địa chỉ nhận hàng mới!', 'success');
      applyAddressToCheckoutForm(newAddr);
      addFormBox.style.display = 'none';

      document.getElementById('new-addr-name').value = '';
      document.getElementById('new-addr-phone').value = '';
      document.getElementById('new-addr-detail').value = '';
      document.getElementById('new-addr-default').checked = false;

      renderAddressBookList();
    };
  }

  // --- VOUCHER & PRICING ENGINE ---
  let currentDiscount = 0;
  let appliedVoucher = null;

  function calculateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    let shippingFee = 35000;
    if (subtotal >= 2000000) {
      shippingFee = 0; // Free ship for orders >= 2M
    }

    // Nếu có voucher freeship
    if (appliedVoucher && appliedVoucher.type === 'freeship') {
      currentDiscount = Math.min(shippingFee, appliedVoucher.value || 35000);
    }

    const finalTotal = Math.max(0, subtotal + shippingFee - currentDiscount);

    if (subtotalElem) subtotalElem.textContent = formatVND(subtotal);
    if (shippingElem) {
      shippingElem.textContent = shippingFee === 0 ? 'Miễn phí (Đơn > 2tr)' : formatVND(shippingFee);
      shippingElem.style.color = shippingFee === 0 ? '#10b981' : '';
    }
    if (discountElem) {
      discountElem.textContent = currentDiscount > 0 ? `-${formatVND(currentDiscount)}` : '0 đ';
      discountElem.style.color = currentDiscount > 0 ? '#ef4444' : '';
    }
    if (totalElem) totalElem.textContent = formatVND(finalTotal);

    return { subtotal, shippingFee, discount: currentDiscount, finalTotal };
  }

  function renderCartList() {
    const cart = Storage.getCart();

    if (cart.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      const mainCols = document.querySelector('.tz-checkout-layout');
      if (mainCols) mainCols.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    const mainCols = document.querySelector('.tz-checkout-layout');
    if (mainCols) mainCols.style.display = 'grid';

    cartListWrap.innerHTML = cart.map(item => `
      <div class="tz-cart-row" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div class="tz-cart-meta">
          <div class="tz-cart-title" title="${item.name}">${item.name}</div>
          <div class="tz-cart-price">${formatVND(item.price)}</div>
        </div>
        <div class="tz-qty-controls">
          <button type="button" class="tz-qty-btn btn-minus" data-id="${item.id}">-</button>
          <span class="tz-qty-val">${item.quantity || 1}</span>
          <button type="button" class="tz-qty-btn btn-plus" data-id="${item.id}">+</button>
        </div>
        <button type="button" class="tz-cart-remove-btn" data-id="${item.id}" title="Xóa">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `).join('');

    calculateTotals(cart);
    bindCartEvents();
  }

  function bindCartEvents() {
    const minusBtns = cartListWrap.querySelectorAll('.btn-minus');
    const plusBtns = cartListWrap.querySelectorAll('.btn-plus');
    const removeBtns = cartListWrap.querySelectorAll('.tz-cart-remove-btn');

    minusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        Storage.updateQuantity(btn.dataset.id, -1);
        renderCartList();
        if (appliedVoucher) applyVoucher(appliedVoucher.code, false);
      });
    });

    plusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        Storage.updateQuantity(btn.dataset.id, 1);
        renderCartList();
        if (appliedVoucher) applyVoucher(appliedVoucher.code, false);
      });
    });

    removeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        Storage.removeFromCart(btn.dataset.id);
        showToast('Đã xóa thiết bị khỏi giỏ hàng', 'info');
        renderCartList();
        if (appliedVoucher) applyVoucher(appliedVoucher.code, false);
      });
    });
  }

  // --- LOGIC VOUCHER CHỌN & ÁP DỤNG MÃ ---
  function updateVoucherUI() {
    const userVouchers = VoucherService.getUserVouchers(currentUser);
    const availVouchers = userVouchers.filter(v => !v.isUsed);
    const countBadge = document.getElementById('checkout-voucher-avail-count');
    if (countBadge) countBadge.textContent = availVouchers.length;

    const appliedBanner = document.getElementById('applied-voucher-tag');
    if (appliedBanner) {
      if (appliedVoucher && currentDiscount > 0) {
        appliedBanner.innerHTML = `
          <div class="applied-voucher-chip">
            <div style="display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-circle-check" style="color: #10b981; font-size: 1.1rem;"></i>
              <div>
                <span style="font-weight: 700; color: #1e293b;">Đã áp dụng mã: <span style="color: #0284c7;">${appliedVoucher.code}</span></span>
                <span class="badge-discount-amount">-${formatVND(currentDiscount)}</span>
              </div>
            </div>
            <button type="button" class="btn-remove-voucher" id="btn-cancel-applied-voucher" title="Bỏ áp dụng mã">
              <i class="fa-solid fa-xmark"></i> Bỏ chọn
            </button>
          </div>
        `;
        appliedBanner.style.display = 'block';
        const cancelBtn = appliedBanner.querySelector('#btn-cancel-applied-voucher');
        if (cancelBtn) {
          cancelBtn.onclick = () => {
            appliedVoucher = null;
            currentDiscount = 0;
            if (voucherInput) voucherInput.value = '';
            showToast('Đã hủy áp dụng mã giảm giá', 'info');
            renderCartList();
            updateVoucherUI();
          };
        }
      } else {
        appliedBanner.style.display = 'none';
        appliedBanner.innerHTML = '';
      }
    }
  }

  function applyVoucher(code, notify = true) {
    if (!code || !code.trim()) return;
    const cleanCode = code.trim().toUpperCase();
    const userVouchers = VoucherService.getUserVouchers(currentUser);
    let target = userVouchers.find(v => v.code.toUpperCase() === cleanCode);

    // Fallback nếu người dùng gõ mã chung
    if (!target) {
      if (cleanCode === 'TECHZONE50' || cleanCode === 'TZ50K') {
        target = { code: 'TECHZONE50', title: 'Giảm 50.000đ', type: 'fixed', value: 50000, minOrder: 300000, isUsed: false };
      } else if (cleanCode === 'FREESHIP') {
        target = { code: 'FREESHIP', title: 'Freeship 35k', type: 'freeship', value: 35000, minOrder: 300000, isUsed: false };
      }
    }

    if (!target) {
      if (notify) showToast(`Mã giảm giá "${cleanCode}" không tồn tại hoặc không thuộc về tài khoản này!`, 'error', 'Mã không hợp lệ');
      return;
    }

    if (target.isUsed) {
      if (notify) showToast(`Mã giảm giá "${cleanCode}" đã được sử dụng ở đơn hàng trước!`, 'warning', 'Mã đã sử dụng');
      return;
    }

    const cart = Storage.getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    if (target.minOrder && subtotal < target.minOrder) {
      if (notify) showToast(`Đơn hàng cần tối thiểu ${formatVND(target.minOrder)} để áp dụng mã ${target.code}!`, 'warning', 'Chưa đủ điều kiện');
      return;
    }

    // Tính toán chiết khấu
    let discountAmount = 0;
    if (target.type === 'fixed') {
      discountAmount = target.value;
    } else if (target.type === 'freeship') {
      let shippingFee = subtotal >= 2000000 ? 0 : 35000;
      discountAmount = Math.min(shippingFee, target.value);
    } else if (target.type === 'percent') {
      discountAmount = Math.round((subtotal * target.value) / 100);
      if (target.maxDiscount && discountAmount > target.maxDiscount) {
        discountAmount = target.maxDiscount;
      }
    }

    currentDiscount = discountAmount;
    appliedVoucher = target;
    if (voucherInput) voucherInput.value = target.code;

    if (notify) {
      showToast(`Áp dụng thành công mã <strong>${target.code}</strong>! Tiết kiệm ${formatVND(currentDiscount)}`, 'success', 'Áp dụng mã thành công');
    }

    renderCartList();
    updateVoucherUI();
  }

  // Bind Submit Voucher Form
  if (voucherForm && voucherInput) {
    voucherForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyVoucher(voucherInput.value);
    });
  }

  // Bind Voucher Picker Modal
  const openVoucherModalBtn = document.getElementById('btn-open-voucher-modal');
  const voucherModal = document.getElementById('tz-voucher-modal');
  const closeVoucherModalBtn = document.getElementById('btn-close-voucher-modal');
  const voucherModalList = document.getElementById('voucher-modal-list');

  function openVoucherModal() {
    if (!voucherModal || !voucherModalList) return;
    const userVouchers = VoucherService.getUserVouchers(currentUser);
    const cart = Storage.getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    if (userVouchers.length === 0) {
      voucherModalList.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: #64748b;">
          <i class="fa-solid fa-ticket" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 8px;"></i>
          <p>Hiện bạn chưa có mã giảm giá nào trong ví. Hãy tham gia các chương trình Flash Sale để nhận mã nhé!</p>
        </div>
      `;
    } else {
      voucherModalList.innerHTML = userVouchers.map(v => {
        const isEligible = !v.isUsed && subtotal >= (v.minOrder || 0);
        const isCurrentlyApplied = appliedVoucher && appliedVoucher.code === v.code;
        return `
          <div class="voucher-picker-card ${v.isUsed ? 'is-used' : ''} ${isCurrentlyApplied ? 'is-applied' : ''}">
            <div class="vpc-left" style="background: ${v.badgeColor || '#0284c7'};">
              <span class="vpc-tag">${v.badgeText || 'VOUCHER'}</span>
            </div>
            <div class="vpc-body">
              <div class="vpc-title">${v.title}</div>
              <div class="vpc-desc">${v.description}</div>
              <div class="vpc-meta">
                <span class="vpc-code">${v.code}</span>
                <span class="vpc-expiry"><i class="fa-regular fa-clock"></i> HSD: ${v.expiryDate}</span>
              </div>
            </div>
            <div class="vpc-action">
              ${v.isUsed ? `
                <span class="badge-used-stamp">Đã dùng</span>
              ` : isCurrentlyApplied ? `
                <button type="button" class="btn-applied-status" disabled><i class="fa-solid fa-check"></i> Đang dùng</button>
              ` : isEligible ? `
                <button type="button" class="btn-select-vcode btn-shopee-primary" data-code="${v.code}">Áp dụng</button>
              ` : `
                <button type="button" class="btn-ineligible" disabled title="Chưa đạt giá trị đơn tối thiểu">Chưa đủ ĐK</button>
              `}
            </div>
          </div>
        `;
      }).join('');

      voucherModalList.querySelectorAll('.btn-select-vcode').forEach(btn => {
        btn.onclick = () => {
          const code = btn.dataset.code;
          applyVoucher(code);
          closeVoucherModal();
        };
      });
    }

    voucherModal.classList.add('active');
  }

  function closeVoucherModal() {
    if (voucherModal) voucherModal.classList.remove('active');
  }
  window.openCheckoutVoucherModal = openVoucherModal;

  if (openVoucherModalBtn) openVoucherModalBtn.onclick = openVoucherModal;
  if (closeVoucherModalBtn) closeVoucherModalBtn.onclick = closeVoucherModal;
  if (voucherModal) {
    voucherModal.onclick = (e) => {
      if (e.target === voucherModal) closeVoucherModal();
    };
  }

  // Tự động áp dụng mã nếu chuyển hướng từ Kho Voucher
  const preSelectedCode = sessionStorage.getItem('selected_voucher_code');
  if (preSelectedCode) {
    setTimeout(() => {
      applyVoucher(preSelectedCode);
      sessionStorage.removeItem('selected_voucher_code');
    }, 300);
  }

  updateVoucherUI();

  const shippingRadios = document.querySelectorAll('input[name="shipping_service"]');
  shippingRadios.forEach(r => {
    r.addEventListener('change', () => {
      renderCartList();
    });
  });

  // Handle Checkout Form Submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cart = Storage.getCart();
      if (cart.length === 0) {
        showToast('Giỏ hàng trống! Vui lòng chọn sản phẩm.', 'warning');
        return;
      }

      const fullname = document.getElementById('cust-name').value.trim();
      const phone = document.getElementById('cust-phone').value.trim();
      const city = document.getElementById('cust-city').value;
      const address = document.getElementById('cust-address').value.trim();
      const note = document.getElementById('cust-note') ? document.getElementById('cust-note').value.trim() : '';

      if (!fullname || !phone || !address) {
        showToast('Vui lòng điền đầy đủ các thông tin giao hàng bắt buộc!', 'warning');
        return;
      }

      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(phone)) {
        showToast('Số điện thoại không hợp lệ! Vui lòng kiểm tra lại.', 'error');
        return;
      }

      const { subtotal, shippingFee, discount, finalTotal } = calculateTotals(cart);

      // Order ID Shopee Express: SPX-XXXXXX
      const spxNum = Math.floor(100000 + Math.random() * 900000);
      const randomId = 'SPX-' + spxNum;
      const legacyId = 'TZ-' + (spxNum % 90000 + 10000);

      const couriers = [
        { name: 'Shopee Express (SPX Speed Hỏa Tốc)', shipper: 'Trần Hoàng Nam', phone: '0988.223.344', plate: '29B1 - 892.45', rating: '4.98 ⭐' },
        { name: 'Shopee Express (SPX Nhanh)', shipper: 'Đỗ Văn Tuấn', phone: '0977.112.334', plate: '59K2 - 689.12', rating: '4.9 ⭐' },
        { name: 'Shopee Express (SPX Hỏa Tốc)', shipper: 'Nguyễn Quang Hải', phone: '0935.889.012', plate: '43D1 - 998.45', rating: '5.0 ⭐' }
      ];
      const assigned = couriers[Math.floor(Math.random() * couriers.length)];

      const paymentRadio = document.querySelector('input[name="payment_choice"]:checked');
      const paymentName = paymentRadio ? paymentRadio.dataset.name || paymentRadio.value : 'Thanh toán COD';

      const shippingRadio = document.querySelector('input[name="shipping_service"]:checked');
      const shippingMethodName = shippingRadio ? shippingRadio.dataset.name : 'Giao Hỏa Tốc SPX 2H';

      const newOrder = {
        id: randomId,
        userEmail: currentUser.email.toLowerCase().trim(),
        userId: currentUser.username || currentUser.email,
        aliases: [legacyId],
        createdAt: new Date().toLocaleString('vi-VN', { hour12: false }),
        status: 'Chờ xác nhận',
        etaSeconds: 7200, // 2 hours countdown
        etaText: 'Dự kiến giao trong 2 giờ tới',
        shippingCourier: assigned.name,
        shippingNotification: '📦 Người gửi đang chuẩn bị đơn hàng và in phiếu gửi SPX',
        shipper: {
          name: assigned.shipper,
          phone: assigned.phone,
          plate: assigned.plate,
          rating: assigned.rating,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'
        },
        customer: {
          name: fullname,
          phone: phone,
          address: `${address}, ${city}`,
          note: note
        },
        shippingMethod: shippingMethodName,
        paymentMethod: paymentName,
        items: [...cart],
        subtotal: subtotal,
        shippingFee: shippingFee,
        discountAmount: discount,
        total: finalTotal,
        voucherCode: appliedVoucher ? appliedVoucher.code : null,
        checkpoints: [
          { time: 'Vừa xong', text: 'Đơn hàng đã được khởi tạo thành công trên hệ thống TechZone Official Store.' },
          { time: 'Chờ xác nhận', text: 'Người bán TechZone đang chuẩn bị bưu kiện và in mã vận đơn Shopee Express.' }
        ]
      };

      // Đánh dấu voucher đã sử dụng trong kho voucher của user
      if (appliedVoucher) {
        VoucherService.markVoucherAsUsed(appliedVoucher.code, currentUser, randomId);
      }

      Storage.addOrder(newOrder);
      Storage.clearCart();

      const savingMsg = discount > 0 ? ` (Đã tiết kiệm ${formatVND(discount)} với mã ${appliedVoucher.code})` : '';
      showToast(`Tạo đơn hàng <strong>${randomId}</strong> thành công!${savingMsg}`, 'success');

      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang khởi tạo lộ trình giao hàng...';
      }

      setTimeout(() => {
        window.location.href = `tracking-detail.html?id=${encodeURIComponent(randomId)}`;
      }, 1100);
    });
  }

  renderCartList();
}


// --- 8. PAGE LOGIC: ORDER TRACKING DETAIL (tracking-detail.html) - CHUẨN SHOPEE EXPRESS (SPX) ---
let trackingTimerInterval = null;

function initTrackingDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  let orderId = urlParams.get('id');

  let order = null;
  const orders = Storage.getOrders();

  if (orderId) {
    order = Storage.findOrderById(orderId);
  }

  // Fallback to first order if not found
  if (!order) {
    if (orders.length > 0) {
      order = orders[0];
      if (orderId) {
        showToast(`Không tìm thấy mã "${orderId}". Đang hiển thị đơn hàng: #${order.id}`, 'info');
      }
    } else {
      order = INITIAL_MOCK_ORDERS[0];
    }
  }

  renderTrackingView(order);
}

function renderTrackingView(order) {
  // 1. Order Code & Courier Badge
  const codeElem = document.getElementById('tracking-code-val');
  const badgeElem = document.getElementById('tracking-badge-val');
  const courierElem = document.getElementById('tracking-courier-val');

  if (codeElem) codeElem.textContent = '#' + order.id;
  if (courierElem) courierElem.textContent = order.shippingCourier || 'Shopee Express (SPX Speed)';

  if (badgeElem) {
    badgeElem.innerHTML = getStatusBadgeHtml(order.status);
  }

  // 2. Shipper Header Quick Bar (Hiển thị có điều kiện theo trạng thái đơn hàng)
  const shipperBox = document.getElementById('spx-shipper-header-box');
  if (shipperBox) {
    if (order.status === 'Đã hủy') {
      shipperBox.innerHTML = `
        <div style="font-size: 0.88rem; color: #dc2626; font-weight: 600; display: flex; align-items: center; gap: 8px; background: #fef2f2; border: 1px solid #fee2e2; padding: 12px 16px; border-radius: 8px;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.15rem;"></i>
          <div>
            <div>Đơn hàng đã được hủy bỏ. Không phát sinh lộ trình bưu tá giao nhận.</div>
            ${order.cancelReason ? `<div style="font-size: 0.8rem; color: #991b1b; font-weight: normal; margin-top: 2px;">Lý do: <strong>${order.cancelReason}</strong> ${order.cancelDate ? `(${order.cancelDate})` : ''}</div>` : ''}
          </div>
        </div>
      `;
    } else if (order.status === 'Chờ xác nhận' || order.status === 'Đang đóng gói' || order.status === 'Đã xác nhận' || order.status === 'Đã đặt') {
      // TUYỆT ĐỐI KHÔNG HIỂN THỊ thông tin Shipper (tên, SĐT, biển số xe) vì lúc này shipper chưa tiếp nhận đơn!
      // Hiển thị khối thông báo trạng thái kho kèm nút Hủy đơn hàng
      shipperBox.innerHTML = `
        <div class="spx-warehouse-packing-box">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              <i class="fa-solid fa-boxes-packing"></i>
            </div>
            <div>
              <div style="font-weight: 800; font-size: 0.95rem; color: #166534; display: flex; align-items: center; gap: 6px;">
                <span class="live-pulse-dot" style="background: #22c55e;"></span> Đang chuẩn bị và đóng gói tại kho SPX
              </div>
              <div style="font-size: 0.84rem; color: #15803d; margin-top: 2px;">
                Kiện hàng đang được nhân viên kho kiểm tra và đóng gói cẩn thận. Dự kiến bàn giao cho tài xế trong vài phút tới.
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" class="btn-shopee-cancel btn-open-cancel-order" data-id="${order.id}">
              <i class="fa-solid fa-ban"></i> <span>Hủy đơn</span>
            </button>
          </div>
        </div>
      `;

      const cancelBtn = shipperBox.querySelector('.btn-open-cancel-order');
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          openCancelOrderModal(order.id, (cancelledOrder) => {
            renderTrackingView(cancelledOrder);
          });
        };
      }
    } else {
      // CHỈ KHI đơn hàng chuyển sang 'Đang vận chuyển' hoặc 'Đang giao': Mới hiển thị thẻ thông tin Shipper chuyên nghiệp
      const shipper = order.shipper || {
        name: 'Trần Hoàng Nam',
        phone: '0988.223.344',
        plate: '29B1 - 892.45',
        rating: '4.98 ⭐',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'
      };

      shipperBox.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${shipper.avatar}" alt="${shipper.name}" style="width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 2px solid #ee4d2d;">
            <div>
              <div style="font-weight: 700; font-size: 0.95rem; color: #1e293b;">
                Tài xế giao hàng: ${shipper.name} <span style="font-size: 0.76rem; color: #f59e0b; margin-left: 6px;">${shipper.rating}</span>
              </div>
              <div style="font-size: 0.82rem; color: #64748b; margin-top: 2px;">
                <i class="fa-solid fa-motorcycle" style="color: #ee4d2d;"></i> Biển số: <strong>${shipper.plate}</strong> | Hotline tài xế: <strong>${shipper.phone}</strong>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <a href="tel:${shipper.phone}" class="btn-shopee-primary" style="padding: 7px 14px; font-size: 0.82rem;">
              <i class="fa-solid fa-phone"></i> Gọi Shipper
            </a>
            <button type="button" class="btn-shopee-secondary" style="padding: 7px 14px; font-size: 0.82rem;" onclick="showToast('Đang kết nối trung tâm chat SPX với shipper ${shipper.name}...', 'info')">
              <i class="fa-regular fa-comment-dots"></i> Nhắn tin
            </button>
            <button type="button" class="btn-shopee-cancel disabled" data-disabled-cancel="true" title="Đơn hàng đã được bàn giao cho tài xế, không thể hủy. Vui lòng liên hệ Hotline 1800.6868 nếu cần hỗ trợ.">
              <i class="fa-solid fa-lock"></i> Đã bàn giao shipper
            </button>
          </div>
        </div>
      `;

      const disabledCancelBtn = shipperBox.querySelector('[data-disabled-cancel]');
      if (disabledCancelBtn) {
        disabledCancelBtn.onclick = () => {
          showToast('Đơn hàng đã được bàn giao cho tài xế, không thể hủy. Vui lòng liên hệ Hotline 1800.6868 nếu cần hỗ trợ.', 'warning');
        };
      }
    }
  }

  // 3. Countdown Timer JavaScript
  renderCountdownClock(order);

  // 4. Horizontal Timeline 4 bước via CSS Pseudo-elements (::before & ::after)
  renderPseudoTimeline(order);

  // 5. Vertical Timeline chi tiết via CSS ::before
  renderVerticalTimeline(order);

  // 6. Shipper Destination & Package Items List
  renderPackageDestinationBlock(order);
}

function getStatusBadgeHtml(status) {
  let statusClass = 'shipping';
  let dotIcon = 'fa-solid fa-truck-fast';

  if (status === 'Chờ xác nhận' || status === 'Đã xác nhận') {
    statusClass = 'confirmed';
    dotIcon = 'fa-solid fa-box-open';
  } else if (status === 'Đang giao') {
    statusClass = 'shipping';
    dotIcon = 'fa-solid fa-truck-fast';
  } else if (status === 'Đã giao' || status === 'Giao thành công') {
    statusClass = 'delivered';
    dotIcon = 'fa-solid fa-circle-check';
  } else if (status === 'Đã hủy') {
    statusClass = 'cancelled';
    dotIcon = 'fa-solid fa-ban';
  }

  return `<span class="shopee-order-status-badge ${statusClass}"><i class="${dotIcon}"></i> ${status}</span>`;
}

/**
 * MANDATORY CSS PSEUDO-ELEMENTS TIMELINE (HORIZONTAL)
 * - .order-timeline::before  -> Grey background connector line
 * - .order-timeline::after   -> Active Shopee orange dynamic progress fill line
 */
function renderPseudoTimeline(order) {
  const timeline = document.querySelector('.order-timeline');
  if (!timeline) return;

  const steps = [
    { key: 'ordered', name: '1. Đơn Đã Đặt', icon: 'fa-solid fa-file-invoice', time: order.createdAt },
    { key: 'confirmed', name: '2. Đã Xác Nhận', icon: 'fa-solid fa-box-open', time: (order.status !== 'Đã đặt' && order.status !== 'Đã hủy') ? 'Đã đóng hộp SPX' : 'Chờ xác nhận' },
    { key: 'shipping', name: '3. Đang Vận Chuyển', icon: 'fa-solid fa-truck-fast', time: (order.status === 'Đang giao' || order.status === 'Đã giao' || order.status === 'Giao thành công') ? 'Đang giao hỏa tốc' : 'Chờ xuất kho' },
    { key: 'delivered', name: '4. Giao Hàng Thành Công', icon: 'fa-solid fa-circle-check', time: (order.status === 'Đã giao' || order.status === 'Giao thành công') ? 'Đã ký nhận' : 'Dự kiến hôm nay' }
  ];

  let activeIdx = 0;
  if (order.status === 'Chờ xác nhận' || order.status === 'Đã xác nhận') activeIdx = 1;
  else if (order.status === 'Đang giao') activeIdx = 2;
  else if (order.status === 'Đã giao' || order.status === 'Giao thành công') activeIdx = 3;
  else if (order.status === 'Đã hủy') activeIdx = -1;

  let progressPct = 0;
  if (activeIdx === 1) progressPct = 33.33;
  if (activeIdx === 2) progressPct = 66.66;
  if (activeIdx === 3) progressPct = 100;

  timeline.style.setProperty('--progress-width', `${progressPct}%`);

  if (order.status === 'Đã hủy') {
    timeline.classList.add('timeline-cancelled');
    timeline.style.margin = '1rem 0';
    const reasonText = order.cancelReason || 'Đổi ý không muốn mua nữa';
    const dateText = order.cancelDate || 'Hôm nay';
    timeline.innerHTML = `
      <div class="order-cancelled-notice-card">
        <div class="cancelled-icon-badge">
          <i class="fa-solid fa-ban"></i>
        </div>
        <h4 class="cancelled-title">Đơn hàng này đã được hủy bỏ</h4>
        <div class="cancelled-reason-pill">
          <i class="fa-solid fa-circle-exclamation"></i> Lý do hủy: <strong>${reasonText}</strong>
        </div>
        ${order.cancelDate ? `<div class="cancelled-date-text"><i class="fa-regular fa-clock"></i> Thời gian ghi nhận: ${dateText}</div>` : ''}
        <p class="cancelled-desc">
          Đơn hàng không phát sinh bất kỳ khoản phí nào. Quý khách có thể lựa chọn và mua lại các sản phẩm khác tại TechZone bất cứ lúc nào.
        </p>
      </div>
    `;
    return;
  } else {
    timeline.classList.remove('timeline-cancelled');
    timeline.style.margin = '';
  }

  timeline.innerHTML = steps.map((step, idx) => {
    let stateClass = '';
    let nodeIcon = `<i class="${step.icon}"></i>`;

    if (idx < activeIdx) {
      stateClass = 'completed';
      nodeIcon = `<i class="fa-solid fa-check"></i>`;
    } else if (idx === activeIdx) {
      stateClass = 'active';
    }

    return `
      <div class="timeline-step ${stateClass}">
        <div class="timeline-node">
          ${nodeIcon}
        </div>
        <div class="timeline-text-content">
          <div class="timeline-step-name">${step.name}</div>
          <div class="timeline-step-time">${step.time}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Live Countdown Timer (Shopee Express Box)
function renderCountdownClock(order) {
  if (trackingTimerInterval) clearInterval(trackingTimerInterval);

  const container = document.getElementById('tracking-countdown-container');
  if (!container) return;

  if (order.status === 'Đã giao' || order.status === 'Giao thành công') {
    container.innerHTML = `
      <div class="spx-eta-info" style="color: #15803d;">
        <i class="fa-solid fa-circle-check" style="font-size: 1.35rem; color: #16a34a;"></i>
        <div>
          <div>Đơn hàng đã được <strong>Giao hàng thành công</strong> vào ${order.etaText || '11:15 18-10-2026'}!</div>
          <div style="font-size: 0.78rem; color: #166534; font-weight: normal;">Cảm ơn bạn đã tin tưởng mua sắm tại TechZone Official Store.</div>
        </div>
      </div>
      <div class="shopee-btn-group">
        <a href="products.html" class="btn-shopee-primary" style="padding: 7px 16px; font-size: 0.82rem;">
          <i class="fa-solid fa-rotate-right"></i> Mua lại sản phẩm
        </a>
      </div>
    `;
    return;
  }

  if (order.status === 'Đã hủy') {
    container.innerHTML = `
      <div class="spx-eta-info" style="color: #b91c1c;">
        <i class="fa-solid fa-circle-xmark" style="font-size: 1.35rem; color: #ef4444;"></i>
        <div>
          <div>Trạng thái: <strong>Đã hủy đơn hàng</strong></div>
          <div style="font-size: 0.78rem; color: #991b1b; font-weight: normal;">${order.etaText || 'Đã hủy theo yêu cầu người mua'}</div>
        </div>
      </div>
      <div class="shopee-btn-group">
        <a href="products.html" class="btn-shopee-primary" style="padding: 7px 16px; font-size: 0.82rem;">
          <i class="fa-solid fa-bag-shopping"></i> Mua sản phẩm khác
        </a>
      </div>
    `;
    return;
  }

  let remaining = order.etaSeconds !== undefined ? order.etaSeconds : 5400;
  if (remaining <= 0) remaining = 3600;

  function tick() {
    if (remaining <= 0) {
      clearInterval(trackingTimerInterval);
      container.innerHTML = `
        <div class="spx-eta-info" style="color: #b45309;">
          <i class="fa-solid fa-bell" style="font-size: 1.35rem; color: #f59e0b;"></i>
          <div>
            <div>Thông báo vận chuyển: <strong>Kiện hàng đang tới điểm giao của bạn!</strong></div>
            <div style="font-size: 0.78rem; color: #78350f; font-weight: normal;">Shipper đang di chuyển đến địa chỉ, vui lòng chú ý điện thoại.</div>
          </div>
        </div>
      `;
      return;
    }

    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;

    const pad = n => String(n).padStart(2, '0');

    container.innerHTML = `
      <div class="spx-eta-info">
        <i class="fa-solid fa-truck-clock" style="font-size: 1.35rem; color: #b45309;"></i>
        <div>
          <div>Dự kiến giao hàng vào: <strong>${order.etaText || '14:30 Hôm nay, 20-10-2026'}</strong></div>
          <div style="font-size: 0.78rem; color: #78350f; font-weight: normal;">Đang giao bởi ${order.shippingCourier || 'Shopee Express (SPX Speed)'}</div>
        </div>
      </div>
      <div class="spx-countdown-wrap">
        <span class="spx-time-label"><i class="fa-solid fa-stopwatch"></i> Thời gian còn lại:</span>
        <div class="spx-countdown-digits">
          <span class="spx-time-unit">${pad(h)}</span> <span style="font-weight: 900; color: #78350f;">:</span>
          <span class="spx-time-unit">${pad(m)}</span> <span style="font-weight: 900; color: #78350f;">:</span>
          <span class="spx-time-unit">${pad(s)}</span>
        </div>
      </div>
    `;

    remaining--;
  }

  tick();
  trackingTimerInterval = setInterval(tick, 1000);
}

// Vertical Timeline chi tiết bằng CSS ::before
function renderVerticalTimeline(order) {
  const container = document.getElementById('spx-vertical-timeline-container');
  if (!container) return;

  const checkpoints = order.checkpoints || [
    { time: '11:15 Hôm nay', text: 'Shipper đang trên đường giao hàng đến bạn.' },
    { time: '10:50 Hôm nay', text: 'Đơn hàng đã xuất kho trung chuyển SPX Hub.' }
  ];

  container.innerHTML = checkpoints.map((cp, idx) => `
    <div class="spx-v-checkpoint ${idx === 0 ? 'latest' : ''}">
      <div class="spx-v-content">
        <div class="spx-v-desc">${cp.text}</div>
        <div class="spx-v-time">
          <span>${cp.time}</span>
          ${idx === 0 && order.status !== 'Đã hủy' ? '<span class="spx-v-tag">Mới nhất</span>' : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// Khối Địa chỉ nhận hàng & Khối Chi tiết thanh toán chuẩn Shopee
function renderPackageDestinationBlock(order) {
  const addressBox = document.getElementById('tracking-shipper-content');
  const packageBox = document.getElementById('tracking-package-content');

  const customer = order.customer || {
    name: 'Nguyễn Văn Minh',
    phone: '0912.889.900',
    address: 'Số 68 Phố Duy Tân, P. Dịch Vọng Hậu, Q. Cầu Giấy, Hà Nội',
    note: 'Giao trong giờ hành chính'
  };

  if (addressBox) {
    addressBox.innerHTML = `
      <div style="font-size: 1rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-location-dot" style="color: #ee4d2d;"></i> Địa Chỉ Nhận Hàng
      </div>

      <div style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin-bottom: 4px;">
        ${customer.name} <span style="font-weight: 600; color: #64748b; font-size: 0.88rem; margin-left: 8px;">(+84) ${customer.phone}</span>
      </div>

      <div style="font-size: 0.88rem; color: #475569; line-height: 1.5; margin-bottom: 8px;">
        ${customer.address}
      </div>

      ${customer.note ? `
        <div style="font-size: 0.82rem; background: #fff7ed; color: #c2410c; padding: 6px 10px; border-radius: 4px; border-left: 3px solid #f97316; margin-bottom: 12px;">
          <strong>Ghi chú người mua:</strong> ${customer.note}
        </div>
      ` : ''}

      <div style="padding-top: 12px; border-top: 1px dashed #e2e8f0; font-size: 0.82rem; color: #64748b; display: flex; align-items: center; gap: 6px;">
        <i class="fa-solid fa-shield-halved" style="color: #10b981;"></i> Thông tin người nhận được bảo mật bởi Shopee TechZone
      </div>
    `;
  }

  if (packageBox) {
    packageBox.innerHTML = `
      <div style="font-size: 1rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <span><i class="fa-solid fa-boxes-stacked" style="color: #0284c7; margin-right: 6px;"></i> Kiện Hàng (${order.items.length} món)</span>
        <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;"><i class="fa-solid fa-credit-card"></i> ${order.paymentMethod}</span>
      </div>

      <!-- Item list -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px;">
        ${order.items.map(it => `
          <div style="display: flex; align-items: center; gap: 12px; padding-bottom: 10px; border-bottom: 1px solid #f8fafc;">
            <img src="${it.image}" alt="${it.name}" style="width: 56px; height: 56px; object-fit: contain; border-radius: 6px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 2px;">
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 0.88rem; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${it.name}</div>
              <div style="font-size: 0.78rem; color: #64748b; margin-top: 2px;">${it.variant ? 'Phân loại: ' + it.variant : 'Chính Hãng VN/A'}</div>
              <div style="font-size: 0.8rem; color: #334155; margin-top: 2px;">Số lượng: <strong>x${it.quantity}</strong></div>
            </div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #ee4d2d;">${formatVND(it.price * it.quantity)}</div>
          </div>
        `).join('')}
      </div>

      <!-- Financial breakdown -->
      <div style="background-color: #f8fafc; border-radius: 6px; padding: 12px 16px;">
        <div class="tz-summary-row" style="display: flex; justify-content: space-between; font-size: 0.86rem; color: #64748b; margin-bottom: 6px;">
          <span>Tổng tiền hàng:</span>
          <span style="font-weight: 700; color: #1e293b;">${formatVND(order.subtotal || order.total)}</span>
        </div>
        <div class="tz-summary-row" style="display: flex; justify-content: space-between; font-size: 0.86rem; color: #64748b; margin-bottom: 6px;">
          <span>Phí vận chuyển:</span>
          <span style="font-weight: 700; color: #16a34a;">${order.shippingFee === 0 ? 'Miễn phí (Freeship SPX)' : formatVND(order.shippingFee || 0)}</span>
        </div>
        ${order.discountAmount ? `
          <div class="tz-summary-row" style="display: flex; justify-content: space-between; font-size: 0.86rem; color: #0284c7; margin-bottom: 6px;">
            <span>Voucher Shopee Mall:</span>
            <span style="font-weight: 700;">-${formatVND(order.discountAmount)}</span>
          </div>
        ` : ''}
        <div class="tz-summary-row total" style="display: flex; justify-content: space-between; align-items: baseline; padding-top: 8px; border-top: 1px dashed #cbd5e1; margin-top: 4px;">
          <span style="font-weight: 700; color: #1e293b; font-size: 0.95rem;">Tổng thanh toán:</span>
          <span style="font-size: 1.35rem; font-weight: 900; color: #ee4d2d;">${formatVND(order.total)}</span>
        </div>
      </div>
    `;
  }
}


// ==========================================================================
// 10. TRANG KHO VOUCHER CỦA TÔI (vouchers.html)
// ==========================================================================
function updateGlobalVoucherBadges() {
  const currentUser = typeof Auth !== 'undefined' ? Auth.getUser() : null;
  const vouchers = currentUser ? VoucherService.getUserVouchers(currentUser) : [];
  const unusedCount = vouchers.filter(v => !v.isUsed).length;

  // Cập nhật huy hiệu trên menu tài khoản và header (chỉ hiện khi có voucher thật)
  const allBadges = document.querySelectorAll('#userVoucherBadge, .tz-dropdown-voucher-badge, #tz-dropdown-voucher-count, .tz-voucher-badge, #tz-header-voucher-badge');
  allBadges.forEach(badge => {
    if (unusedCount > 0) {
      badge.textContent = unusedCount;
      badge.style.display = 'inline-flex';
    } else {
      badge.textContent = '';
      badge.style.display = 'none';
    }
  });

  const voucherCounterLink = document.querySelector('.btn-voucher-counter');
  if (voucherCounterLink) {
    if (unusedCount > 0) {
      voucherCounterLink.innerHTML = `🎟️ Kho Voucher (${unusedCount})`;
    } else {
      voucherCounterLink.innerHTML = `🎟️ Kho Voucher`;
    }
  }
}

function initVouchersPage() {
  const container = document.getElementById('vouchers-grid-container');
  if (!container) return;

  const currentUser = typeof Auth !== 'undefined' ? Auth.getUser() : null;
  if (!currentUser) {
    // Ẩn huy hiệu menu
    const menuBadge = document.getElementById('userVoucherBadge');
    if (menuBadge) menuBadge.style.display = 'none';

    // Đặt 5 tab về (0)
    const tabAll = document.getElementById('tabAll');
    if (tabAll) tabAll.textContent = 'Tất cả (0)';
    const tabDiscount = document.getElementById('tabDiscount');
    if (tabDiscount) tabDiscount.textContent = 'Mã Giảm Giá TechZone (0)';
    const tabFreeship = document.getElementById('tabFreeship');
    if (tabFreeship) tabFreeship.textContent = 'Miễn Phí Vận Chuyển (0)';
    const tabVip = document.getElementById('tabVip');
    if (tabVip) tabVip.textContent = 'Đặc Quyền VIP (0)';
    const tabUsed = document.getElementById('tabUsed');
    if (tabUsed) tabUsed.textContent = 'Hết hạn / Đã dùng (0)';

    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: #fff7ed; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
          <i class="fa-solid fa-ticket" style="font-size: 2.5rem; color: #ea580c;"></i>
        </div>
        <h3 style="font-size: 1.3rem; font-weight: 800; color: #1e293b; margin: 0 0 0.5rem;">Vui lòng đăng nhập để xem Kho Voucher của bạn</h3>
        <p style="color: #64748b; font-size: 0.9rem; max-width: 480px; margin: 0 auto 1.5rem;">
          Đăng nhập ngay để khám phá và quản lý toàn bộ mã giảm giá cá nhân độc quyền của bạn!
        </p>
        <a href="login.html" class="btn-shopee-primary" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 700; padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none;">
          <i class="fa-solid fa-arrow-right-to-bracket"></i> Đăng nhập ngay
        </a>
      </div>
    `;
    return;
  }

  let currentTab = 'all';

  function renderVouchers() {
    // Lấy danh sách voucher từ localStorage theo khóa: vouchers_${currentUser.email}
    const vouchers = VoucherService.getUserVouchers(currentUser);

    // Đếm đúng số lượng voucher chưa sử dụng (!v.isUsed) theo từng phân loại
    const allCount = vouchers.filter(v => !v.isUsed).length;
    const discountCount = vouchers.filter(v => !v.isUsed && (v.category === 'discount' || v.discountType === 'percent' || (v.code && (v.code.includes('TECH') || v.code.includes('SALE'))))).length;
    const freeshipCount = vouchers.filter(v => !v.isUsed && (v.category === 'freeship' || (v.code && v.code.includes('FREESHIP')))).length;
    const vipCount = vouchers.filter(v => !v.isUsed && (v.category === 'vip' || (v.code && (v.code.includes('VIP') || v.code.includes('SMEMBER'))))).length;
    const expiredCount = vouchers.filter(v => v.isUsed).length;

    // Cập nhật số đếm thực tế vào text của từng tab tương ứng
    const tabAllEl = document.getElementById('tabAll');
    if (tabAllEl) tabAllEl.textContent = `Tất cả (${allCount})`;
    const tabDiscountEl = document.getElementById('tabDiscount');
    if (tabDiscountEl) tabDiscountEl.textContent = `Mã Giảm Giá TechZone (${discountCount})`;
    const tabFreeshipEl = document.getElementById('tabFreeship');
    if (tabFreeshipEl) tabFreeshipEl.textContent = `Miễn Phí Vận Chuyển (${freeshipCount})`;
    const tabVipEl = document.getElementById('tabVip');
    if (tabVipEl) tabVipEl.textContent = `Đặc Quyền VIP (${vipCount})`;
    const tabUsedEl = document.getElementById('tabUsed');
    if (tabUsedEl) tabUsedEl.textContent = `Hết hạn / Đã dùng (${expiredCount})`;

    // Hỗ trợ thẻ span cũ
    const countAllEl = document.getElementById('count-tab-all');
    if (countAllEl) countAllEl.textContent = allCount;
    const countDiscountEl = document.getElementById('count-tab-discount');
    if (countDiscountEl) countDiscountEl.textContent = discountCount;
    const countFreeshipEl = document.getElementById('count-tab-freeship');
    if (countFreeshipEl) countFreeshipEl.textContent = freeshipCount;
    const countVipEl = document.getElementById('count-tab-vip');
    if (countVipEl) countVipEl.textContent = vipCount;
    const countExpiredEl = document.getElementById('count-tab-expired');
    if (countExpiredEl) countExpiredEl.textContent = expiredCount;

    // Hiển thị số lượng lên huy hiệu badge ở menu tài khoản (ẩn nếu không có)
    const menuBadge = document.getElementById('userVoucherBadge');
    if (menuBadge) {
      if (allCount > 0) {
        menuBadge.textContent = allCount;
        menuBadge.style.display = 'inline-flex';
      } else {
        menuBadge.textContent = '';
        menuBadge.style.display = 'none';
      }
    }
    updateGlobalVoucherBadges();

    // Nếu tài khoản CHƯA có voucher nào (mảng rỗng hoặc null):
    if (!vouchers || vouchers.length === 0) {
      container.innerHTML = `
        <div class="empty-vouchers-box" style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
            <i class="fa-solid fa-ticket-simple" style="font-size: 2.5rem; color: #94a3b8;"></i>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin: 0 0 0.5rem;">Bạn chưa có mã giảm giá nào.</h3>
          <p style="color: #64748b; font-size: 0.9rem; max-width: 460px; margin: 0 auto 1.5rem;">
            Hãy nhập mã ưu đãi thủ công ở trên hoặc ghé thăm các chương trình khuyến mãi để rinh deal công nghệ hời nhất!
          </p>
          <a href="index.html" class="btn-shopee-primary" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 700; padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; background: #0284c7; color: #fff;">
            <i class="fa-solid fa-compass"></i> Khám phá ưu đãi ngay
          </a>
        </div>
      `;
      return;
    }

    // Lọc danh sách theo Tab
    let filtered = vouchers;
    if (currentTab === 'all') {
      filtered = vouchers.filter(v => !v.isUsed);
    } else if (currentTab === 'discount') {
      filtered = vouchers.filter(v => !v.isUsed && (v.category === 'discount' || (v.code && (v.code.includes('TECH') || v.code.includes('SALE'))) || v.discountType === 'percent'));
    } else if (currentTab === 'freeship') {
      filtered = vouchers.filter(v => !v.isUsed && (v.category === 'freeship' || (v.code && v.code.includes('FREESHIP'))));
    } else if (currentTab === 'vip') {
      filtered = vouchers.filter(v => !v.isUsed && (v.category === 'vip' || (v.code && (v.code.includes('VIP') || v.code.includes('SMEMBER')))));
    } else if (currentTab === 'expired') {
      filtered = vouchers.filter(v => v.isUsed);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem; background: #fff; border-radius: 14px; border: 1px solid #e2e8f0;">
          <i class="fa-solid fa-ticket-simple" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 0.8rem; display: block;"></i>
          <h4 style="font-weight: 800; color: #1e293b; margin: 0 0 0.35rem;">Chưa có voucher nào trong mục này</h4>
          <p style="color: #64748b; font-size: 0.88rem; margin: 0;">Nhập thêm mã ưu đãi hoặc khám phá các đợt Flash Sale để nhận thêm quà tặng!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(v => {
      const isFreeship = (v.category === 'freeship' || (v.code && v.code.includes('FREESHIP')));
      const isVip = (v.category === 'vip' || (v.code && (v.code.includes('VIP') || v.code.includes('SMEMBER'))));
      const stubClass = isFreeship ? 'stub-green' : isVip ? 'stub-purple' : 'stub-orange';
      const iconHtml = isFreeship ? '<i class="fa-solid fa-truck-fast"></i>' : isVip ? '<i class="fa-solid fa-crown"></i>' : '<i class="fa-solid fa-percent"></i>';
      const badgeText = v.badgeText || (isFreeship ? 'FREESHIP' : isVip ? 'VIP ONLY' : 'TECHZONE');

      let discountFormatted = '';
      if (v.discountType === 'percent') {
        discountFormatted = `Giảm ${v.discountValue}%`;
        if (v.maxDiscount) discountFormatted += ` (tối đa ${formatPrice(v.maxDiscount)})`;
      } else {
        discountFormatted = `Giảm ${formatPrice(v.discountValue)}`;
      }

      const minOrderFormatted = v.minOrder > 0 ? `Đơn tối thiểu ${formatPrice(v.minOrder)}` : 'Đơn từ 0đ';
      const isUsed = !!v.isUsed;

      return `
        <div class="shopee-voucher-ticket ${isUsed ? 'is-used' : ''}">
          <!-- Cột trái (Cuống vé): Màu cam, xanh lá hoặc tím -->
          <div class="svt-stub ${stubClass}">
            <div class="svt-notch top"></div>
            <div class="svt-notch bottom"></div>
            <div class="svt-stub-icon">${iconHtml}</div>
            <div class="svt-stub-badge">${badgeText}</div>
          </div>

          <!-- Đường cắt răng cưa / nét đứt -->
          <div class="svt-perforation"></div>

          <!-- Cột phải (Thân vé) -->
          <div class="svt-body">
            <div class="svt-header">
              <span class="svt-code" title="Mã giảm giá">${escapeHtml(v.code)}</span>
              <span class="svt-category-tag ${isFreeship ? 'tag-green' : isVip ? 'tag-purple' : 'tag-orange'}">
                ${isFreeship ? 'Vận chuyển' : isVip ? 'VIP' : 'Giảm giá'}
              </span>
            </div>

            <h4 class="svt-title">${escapeHtml(v.title || discountFormatted)}</h4>
            <div class="svt-condition"><i class="fa-solid fa-circle-info"></i> ${minOrderFormatted}</div>

            <!-- Hạn dùng & Progress Bar -->
            <div class="svt-expiry-wrap">
              <div class="svt-expiry-meta">
                <span><i class="fa-regular fa-clock"></i> HSD: ${escapeHtml(v.expiryDate || '31/12/2026')}</span>
                <span class="svt-days-left">${isUsed ? 'Đã sử dụng' : 'Còn hiệu lực'}</span>
              </div>
              <div class="svt-progress-bar">
                <div class="svt-progress-fill ${isUsed ? 'fill-gray' : ''}" style="width: ${isUsed ? '0%' : '80%'};"></div>
              </div>
            </div>

            <!-- Chân vé: Nút hành động -->
            <div class="svt-actions">
              <button type="button" class="btn-copy-code" data-code="${escapeHtml(v.code)}" title="Sao chép mã">
                <i class="fa-regular fa-copy"></i> Sao chép
              </button>
              ${isUsed ? `
                <button type="button" class="btn-used-state" disabled>Đã dùng</button>
              ` : `
                <button type="button" class="btn-use-voucher-now" data-code="${escapeHtml(v.code)}">
                  Dùng ngay <i class="fa-solid fa-arrow-right"></i>
                </button>
              `}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind Copy buttons
    container.querySelectorAll('.btn-copy-code').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const code = btn.dataset.code;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(() => {
            showToast(`Đã sao chép mã ${code} vào bộ nhớ tạm!`, 'success', 'Kho Voucher');
            btn.innerHTML = `<i class="fa-solid fa-check"></i> Đã chép`;
            setTimeout(() => {
              btn.innerHTML = `<i class="fa-regular fa-copy"></i> Sao chép`;
            }, 2000);
          });
        }
      };
    });

    // Bind Dùng ngay buttons
    container.querySelectorAll('.btn-use-voucher-now').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const code = btn.dataset.code;
        sessionStorage.setItem('selected_voucher_code', code);
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code);
        }

        const cart = Storage.getCart();
        if (cart && cart.length > 0) {
          showToast(`Đã áp dụng mã ${code}! Đang chuyển tới trang thanh toán...`, 'success', 'Áp dụng ưu đãi');
          setTimeout(() => {
            window.location.href = 'checkout.html';
          }, 600);
        } else {
          showToast(`Đã sao chép mã ${code}! Mời bạn chọn sản phẩm công nghệ yêu thích.`, 'success', 'Kho Voucher');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 600);
        }
      };
    });
  }

  // Bind Tab Click
  const tabButtons = document.querySelectorAll('.v-tab-btn');
  tabButtons.forEach(btn => {
    btn.onclick = () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab || (btn.id === 'tabAll' ? 'all' : btn.id === 'tabDiscount' ? 'discount' : btn.id === 'tabFreeship' ? 'freeship' : btn.id === 'tabVip' ? 'vip' : 'expired');
      renderVouchers();
    };
  });

  // Bind Manual Voucher Form
  const addForm = document.getElementById('form-add-voucher');
  const addInput = document.getElementById('manual-voucher-input');
  if (addForm && addInput) {
    addForm.onsubmit = (e) => {
      e.preventDefault();
      const code = addInput.value.trim().toUpperCase();
      if (!code) {
        showToast('Vui lòng nhập mã voucher hợp lệ!', 'warning', 'Nhập mã');
        return;
      }

      let newVoucher = null;
      if (code === 'TECHZONE100') {
        newVoucher = { code: 'TECHZONE100', title: 'Mã Giảm Giá TechZone: Giảm 100.000đ cho đơn từ 500k', category: 'discount', discountType: 'fixed', discountValue: 100000, minOrder: 500000, expiryDate: '31/12/2026', isUsed: false, badgeColor: '#ef4444', badgeText: 'GIẢM 100K' };
      } else if (code === 'FREESHIP30') {
        newVoucher = { code: 'FREESHIP30', title: 'Miễn phí vận chuyển hỏa tốc 30.000đ', category: 'freeship', discountType: 'fixed', discountValue: 30000, minOrder: 200000, expiryDate: '31/12/2026', isUsed: false, badgeColor: '#10b981', badgeText: 'FREESHIP 30K' };
      } else if (code === 'SMEMBERVIP') {
        newVoucher = { code: 'SMEMBERVIP', title: 'Đặc quyền VIP Smember: Giảm 200.000đ', category: 'vip', discountType: 'fixed', discountValue: 200000, minOrder: 2000000, expiryDate: '31/12/2026', isUsed: false, badgeColor: '#8b5cf6', badgeText: 'VIP ONLY' };
      } else if (code === 'FLASHSALE50') {
        newVoucher = { code: 'FLASHSALE50', title: 'Flash Sale công nghệ: Giảm 50.000đ', category: 'discount', discountType: 'fixed', discountValue: 50000, minOrder: 300000, expiryDate: '31/12/2026', isUsed: false, badgeColor: '#f59e0b', badgeText: 'FLASH SALE' };
      } else {
        newVoucher = {
          code: code,
          title: `Ưu đãi đặc biệt: Giảm 50.000đ khi nhập mã ${code}`,
          category: 'discount',
          discountType: 'fixed',
          discountValue: 50000,
          minOrder: 300000,
          expiryDate: '31/12/2026',
          isUsed: false,
          badgeColor: '#0284c7',
          badgeText: 'ƯU ĐÃI'
        };
      }

      const res = VoucherService.addVoucherToUser(newVoucher, currentUser);
      if (res.success) {
        showToast(res.message, 'success', 'Kho Voucher');
        addInput.value = '';
        renderVouchers();
        updateGlobalVoucherBadges();
      } else {
        showToast(res.message, 'warning', 'Kho Voucher');
      }
    };
  }

  renderVouchers();
}

// --- 9. PAGE LOGIC: ORDER HISTORY (history.html) - CHUẨN GIAO DIỆN SHOPEE ---
function initHistoryPage() {
  const container = document.getElementById('history-cards-container');
  const tabs = document.querySelectorAll('.shopee-tab-item');
  const searchInput = document.getElementById('shopee-search-input');
  const orderSearchBox = document.querySelector('.shopee-history-search');
  const quickVoucherBtn = document.getElementById('btn-quick-voucher-tab');

  if (!container) return;

  // 1. Kiểm tra trạng thái đăng nhập (Auth Guard)
  const currentUser = Auth.getUser();
  if (!currentUser) {
    sessionStorage.setItem('techzone_toast_flash', JSON.stringify({
      title: 'Yêu cầu đăng nhập',
      message: 'Vui lòng đăng nhập để xem lịch sử đơn mua của bạn!',
      type: 'warning'
    }));
    window.location.href = 'login.html';
    return;
  }

  // Cập nhật số lượng voucher trên nút Kho Voucher
  function updateVoucherCountBadge() {
    const userVouchers = VoucherService.getUserVouchers(currentUser);
    const unusedCount = userVouchers.filter(v => !v.isUsed).length;

    const voucherCountEl = document.getElementById('header-voucher-count');
    if (voucherCountEl) voucherCountEl.textContent = unusedCount;

    const counterLink = document.querySelector('.btn-voucher-counter');
    if (counterLink) counterLink.innerHTML = `🎟️ Kho Voucher ( ${unusedCount} )`;
  }
  updateVoucherCountBadge();

  // Đọc tab từ URL nếu có (?tab=warranty)
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');
  let currentFilter = (tabParam === 'warranty') ? 'warranty' : 'all';
  let searchQuery = '';

  // Đồng bộ active tab ban đầu
  tabs.forEach(t => {
    if (t.dataset.status === currentFilter) t.classList.add('active');
    else t.classList.remove('active');
  });

  function renderHistory() {
    // Ẩn thanh tìm kiếm đơn mua khi ở tab Tra cứu bảo hành (tránh 2 ô tìm kiếm trùng lặp)
    if (orderSearchBox) {
      orderSearchBox.style.display = (currentFilter === 'warranty') ? 'none' : 'flex';
    }

    // A. NẾU CHỌN TAB "TRA CỨU BẢO HÀNH"
    if (currentFilter === 'warranty') {
      renderWarrantyView();
      return;
    }

    // B. TAB ĐƠN HÀNG THÔNG THƯỜNG (All, Chờ xác nhận, Đang giao, Đã giao, Đã hủy)
    const allOrders = Storage.getOrders();
    const cEmail = (currentUser.email || '').toLowerCase().trim();

    // Lọc những đơn hàng thuộc về chính tài khoản này
    let userOrders = allOrders.filter(o => {
      const oEmail = (o.userEmail || o.customer?.email || '').toLowerCase().trim();
      if (cEmail && oEmail && cEmail === oEmail) return true;
      if (currentUser.username === 'admin' && (o.customer?.name === 'Quản trị viên TechZone' || o.id === 'SPX-892341' || !o.userEmail || o.userEmail === 'admin@gmail.com')) {
        return true;
      }
      return false;
    });

    if (userOrders.length === 0) {
      container.innerHTML = `
        <div class="shopee-empty-state" style="text-align: center; padding: 4.5rem 1rem; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="width: 90px; height: 90px; border-radius: 50%; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
            <i class="fa-solid fa-box-open" style="font-size: 3rem; color: #cbd5e1;"></i>
          </div>
          <h3 style="color: #1e293b; font-weight: 800; font-size: 1.25rem; margin: 0 0 0.4rem;">Chưa có đơn hàng nào</h3>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0 0 1.5rem;">Bạn chưa có đơn mua nào trên hệ thống TechZone. Hãy săn ngay các deal công nghệ hot hôm nay!</p>
          <a href="index.html" class="btn-shopee-primary" style="display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; font-weight: 700; padding: 0.75rem 1.8rem; text-decoration: none; border-radius: 8px;">
            <i class="fa-solid fa-bag-shopping"></i> Khám phá sản phẩm ngay
          </a>
        </div>
      `;
      return;
    }

    let filtered = userOrders;

    if (currentFilter !== 'all') {
      if (currentFilter === 'Chờ xác nhận') {
        filtered = userOrders.filter(o => o.status === 'Chờ xác nhận' || o.status === 'Đang đóng gói' || o.status === 'Đã xác nhận' || o.status === 'Đã đặt');
      } else if (currentFilter === 'Đang giao') {
        filtered = userOrders.filter(o => o.status === 'Đang giao' || o.status === 'Đang vận chuyển');
      } else if (currentFilter === 'Đã giao') {
        filtered = userOrders.filter(o => o.status === 'Đã giao' || o.status === 'Giao thành công');
      } else if (currentFilter === 'Đã hủy') {
        filtered = userOrders.filter(o => o.status === 'Đã hủy');
      } else {
        filtered = userOrders.filter(o => o.status === currentFilter);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(o => {
        const idMatch = o.id.toLowerCase().includes(q) || (o.aliases && o.aliases.some(a => a.toLowerCase().includes(q)));
        const itemsMatch = o.items && o.items.some(it => it.name.toLowerCase().includes(q));
        const customerMatch = o.customer && o.customer.name.toLowerCase().includes(q);
        return idMatch || itemsMatch || customerMatch;
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4.5rem 1rem; background: white; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <i class="fa-solid fa-receipt" style="font-size: 3.5rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
          <h4 style="color: #64748b; font-weight: 800; font-size: 1.15rem;">Chưa có đơn hàng nào</h4>
          <p style="color: #94a3b8; font-size: 0.88rem; margin-top: 0.35rem;">Không tìm thấy đơn hàng phù hợp với trạng thái hoặc từ khóa tìm kiếm.</p>
          <a href="products.html" class="btn-shopee-primary" style="margin-top: 1.35rem; font-size: 0.88rem; padding: 0.65rem 1.6rem;">
            <i class="fa-solid fa-bag-shopping"></i> Khám phá sản phẩm TechZone
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(o => {
      let statusClass = 'shipping';
      let statusIcon = 'fa-solid fa-truck-fast';
      let statusLabel = o.status;

      if (o.status === 'Chờ xác nhận' || o.status === 'Đã xác nhận') {
        statusClass = 'confirmed';
        statusIcon = 'fa-solid fa-box-open';
        statusLabel = 'Chờ xác nhận';
      } else if (o.status === 'Đang giao') {
        statusClass = 'shipping';
        statusIcon = 'fa-solid fa-truck-fast';
        statusLabel = 'Đang vận chuyển';
      } else if (o.status === 'Đã giao' || o.status === 'Giao thành công') {
        statusClass = 'delivered';
        statusIcon = 'fa-solid fa-circle-check';
        statusLabel = 'Giao hàng thành công';
      } else if (o.status === 'Đã hủy') {
        statusClass = 'cancelled';
        statusIcon = 'fa-solid fa-ban';
        statusLabel = 'Đã hủy';
      }

      const totalItemsCount = o.items.reduce((sum, it) => sum + (it.quantity || 1), 0);

      const itemsHtml = o.items.map(it => `
        <div class="shopee-item-row" data-order-id="${o.id}">
          <img src="${it.image}" alt="${it.name}" class="shopee-thumb">
          <div class="shopee-item-details">
            <h4 class="shopee-item-title" title="${it.name}">${it.name}</h4>
            <div class="shopee-item-variant"><i class="fa-solid fa-tags" style="color: #94a3b8; font-size: 0.72rem;"></i> Phân loại: ${it.variant || 'Chính hãng VN/A'}</div>
            <div class="shopee-item-qty">Số lượng: x${it.quantity || 1}</div>
          </div>
          <div class="shopee-item-price">
            ${formatVND(it.price * (it.quantity || 1))}
          </div>
        </div>
      `).join('');

      const isCancelled = o.status === 'Đã hủy';
      const isDelivered = o.status === 'Đã giao' || o.status === 'Giao thành công';
      const latestCheckpoint = (o.checkpoints && o.checkpoints.length > 0) ? o.checkpoints[0] : null;

      let notificationText = o.shippingNotification;
      if (!notificationText || isDelivered) {
        if (o.status === 'Đang giao' || o.status === 'Đang vận chuyển') {
          notificationText = '🚚 Đang giao hàng đến bạn';
        } else if (isDelivered) {
          notificationText = 'Đơn hàng đã được giao thành công';
        } else if (o.status === 'Chờ xác nhận') {
          notificationText = '📦 Người gửi đang chuẩn bị đơn hàng và in phiếu gửi SPX';
        }
      }

      return `
        <div class="shopee-order-card" data-order-id="${o.id}">
          <div class="shopee-card-header">
            <div class="shopee-shop-info">
              <span class="shopee-mall-badge"><i class="fa-solid fa-store"></i> TechZone Official Mall</span>
              <span class="shopee-order-id">Mã đơn: <strong>${o.id}</strong></span>
              ${o.voucherCode ? `<span class="badge-voucher-applied-pill" title="Đã giảm ${formatVND(o.discountAmount || 0)}"><i class="fa-solid fa-ticket"></i> ${o.voucherCode}</span>` : ''}
            </div>
            <div class="shopee-status-badge ${statusClass}">
              <i class="${statusIcon}"></i>
              <span>${statusLabel}</span>
            </div>
          </div>

          <div class="shopee-order-body">
            ${itemsHtml}
            ${isCancelled ? `
              <div class="shopee-shipping-strip cancelled" style="cursor: default;" title="Đơn hàng này đã bị hủy">
                <i class="fa-solid fa-ban" style="color: #dc2626;"></i>
                <div class="strip-text-box">
                  <div class="strip-main-text" style="color: #dc2626; font-weight: 700;">
                    🚫 Đơn hàng đã hủy ${o.cancelReason ? `(Lý do: ${o.cancelReason})` : 'thành công'}
                  </div>
                  <div class="strip-sub-text">Yêu cầu hoàn tất lúc: ${o.cancelledAt || o.createdAt}</div>
                </div>
              </div>
            ` : `
              <div class="shopee-shipping-strip ${statusClass}" data-order-id="${o.id}" title="Nhấp để xem lộ trình chi tiết">
                <i class="fa-solid fa-truck-fast"></i>
                <div class="strip-text-box">
                  <div class="strip-main-text">${notificationText}</div>
                  ${latestCheckpoint ? `<div class="strip-sub-text"><i class="fa-solid fa-clock-rotate-left"></i> ${latestCheckpoint.time}: ${latestCheckpoint.text}</div>` : ''}
                </div>
                <div class="strip-view-link">
                  <span>Xem tiến trình</span>
                  <i class="fa-solid fa-chevron-right"></i>
                </div>
              </div>
            `}
          </div>

          <div class="shopee-card-footer">
            <div class="shopee-footer-action-row">
              <div class="shopee-total-wrap">
                <i class="fa-solid fa-shield-halved shopee-shield-icon" style="color: #10b981;" title="TechZone bảo hiểm người mua"></i>
                <span class="shopee-total-label">Thành tiền (${totalItemsCount} sản phẩm):</span>
                <span class="shopee-total-price">${formatVND(o.total)}</span>
              </div>

              <div class="shopee-btn-group ${isCancelled ? 'has-2-btns' : isDelivered ? 'has-4-btns' : 'has-3-btns'}">
                ${isCancelled ? `
                  <a href="tracking-detail.html?id=${encodeURIComponent(o.id)}" class="btn-shopee-secondary" title="Xem chi tiết đơn hàng đã hủy">
                    <i class="fa-solid fa-circle-info"></i> <span>Chi tiết đơn</span>
                  </a>
                  <button type="button" class="btn-shopee-primary btn-reorder-order" data-id="${o.id}" title="Thêm lại các sản phẩm vào giỏ hàng và mua lại">
                    <i class="fa-solid fa-rotate-right"></i> <span>Mua lại</span>
                  </button>
                ` : `
                  ${(o.status === 'Chờ xác nhận' || o.status === 'Đang đóng gói' || o.status === 'Đã xác nhận' || o.status === 'Đã đặt') ? `
                    <button type="button" class="btn-shopee-cancel btn-open-cancel-order" data-id="${o.id}">
                      <i class="fa-solid fa-ban"></i> <span>Hủy đơn</span>
                    </button>
                  ` : ''}
                  
                  ${isDelivered ? `
                    <button type="button" class="btn-shopee-secondary btn-order-claim-warranty" data-order-id="${o.id}" title="Yêu cầu bảo hành / sửa chữa thiết bị">
                      <i class="fa-solid fa-screwdriver-wrench" style="color: #0284c7;"></i> <span>Bảo hành</span>
                    </button>
                  ` : ''}
                  
                  <button type="button" class="btn-shopee-secondary btn-quick-timeline" data-id="${o.id}" title="Xem popup tiến trình ngay tại trang này">
                    <i class="fa-solid fa-eye"></i> <span>Xem nhanh</span>
                  </button>
                  
                  <a href="tracking-detail.html?id=${encodeURIComponent(o.id)}" class="btn-shopee-primary btn-track-prominent" title="Mở trang chi tiết lộ trình vận chuyển">
                    <i class="fa-solid fa-route"></i> <span>Lộ trình</span>
                  </a>
                `}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind Click-to-view events
    container.querySelectorAll('.shopee-order-body, .shopee-shipping-strip').forEach(el => {
      el.addEventListener('click', (e) => {
        const orderId = el.dataset.orderId || el.closest('.shopee-order-card')?.dataset.orderId;
        if (orderId && !el.classList.contains('cancelled')) {
          window.location.href = `tracking-detail.html?id=${encodeURIComponent(orderId)}`;
        }
      });
    });

    // Bind Reorder buttons
    container.querySelectorAll('.btn-reorder-order').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = btn.dataset.id;
        const targetOrder = Storage.findOrderById(orderId);
        if (!targetOrder || !targetOrder.items || targetOrder.items.length === 0) {
          showToast('Không thể lấy thông tin sản phẩm từ đơn hàng này.', 'warning');
          return;
        }

        let addedCount = 0;
        targetOrder.items.forEach(it => {
          const success = Storage.addToCart(it, it.quantity || 1);
          if (success) addedCount++;
        });

        if (addedCount > 0) {
          showToast(`Đã thêm ${addedCount} sản phẩm vào giỏ hàng! Đang chuyển đến trang thanh toán...`, 'success');
          setTimeout(() => {
            window.location.href = 'checkout.html';
          }, 600);
        } else {
          showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', 'warning');
        }
      });
    });

    // Bind Quick Timeline Modal buttons
    container.querySelectorAll('.btn-quick-timeline').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = btn.dataset.id;
        openHistoryTimelineModal(orderId);
      });
    });

    // Bind Order Warranty Claim button
    container.querySelectorAll('.btn-order-claim-warranty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = btn.dataset.orderId;
        const targetOrder = Storage.findOrderById(orderId);
        if (targetOrder && targetOrder.items && targetOrder.items.length > 0) {
          const wInfo = WarrantyService.getWarrantyInfo(targetOrder, targetOrder.items[0]);
          openWarrantyClaimModal(wInfo);
        }
      });
    });

    // Bind Cancel Order buttons in History Cards
    container.querySelectorAll('.btn-open-cancel-order').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = btn.dataset.id;
        openCancelOrderModal(orderId, () => {
          currentFilter = 'Đã hủy';
          tabs.forEach(t => {
            if (t.dataset.status === 'Đã hủy') t.classList.add('active');
            else t.classList.remove('active');
          });
          renderHistory();
        });
      });
    });
  }

  // --- HÀM RENDER GIAO DIỆN TRA CỨU BẢO HÀNH ĐIỆN TỬ (CHỈ SẢN PHẨM ĐÃ GIAO) ---
  function renderWarrantyView() {
    let warranties = searchQuery.trim() 
      ? WarrantyService.lookup(searchQuery, currentUser) 
      : WarrantyService.getUserDeliveredWarranties(currentUser);

    container.innerHTML = `
      <div class="warranty-view-container">
        <!-- Thanh tìm kiếm nhanh: Số điện thoại hoặc Số IMEI/Mã đơn hàng -->
        <div class="warranty-search-card">
          <div class="wsc-header">
            <div class="wsc-icon"><i class="fa-solid fa-shield-halved"></i></div>
            <div>
              <h3>Tra Cứu Bảo Hành Điện Tử TechZone</h3>
              <p>Nhập Số điện thoại nhận hàng, Số IMEI (VD: TZ-VN/A-992812) hoặc Mã đơn hàng SPX</p>
            </div>
          </div>
          <div class="wsc-input-row">
            <div class="wsc-input-wrap">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" id="warranty-search-field" placeholder="Nhập Số điện thoại hoặc Số IMEI/Mã đơn hàng..." value="${escapeHtml(searchQuery)}">
            </div>
            <button type="button" id="btn-submit-warranty-search" class="btn-shopee-primary">
              <i class="fa-solid fa-search"></i> Tra cứu
            </button>
            ${searchQuery ? `<button type="button" id="btn-clear-warranty-search" class="btn-shopee-secondary">Tất cả sản phẩm đã giao</button>` : ''}
          </div>
          <div class="wsc-badges-row">
            <span><i class="fa-solid fa-circle-check text-success"></i> Tự động kích hoạt theo đơn đã giao</span>
            <span><i class="fa-solid fa-rotate-left text-primary"></i> 1-đổi-1 trong 30 ngày</span>
            <span><i class="fa-solid fa-screwdriver-wrench text-warning"></i> Tiếp nhận tại nhà qua bưu tá SPX</span>
          </div>
        </div>

        <!-- Danh sách các sản phẩm ĐÃ GIAO THÀNH CÔNG của tài khoản -->
        <div class="warranty-list-grid">
          ${warranties.length === 0 ? `
            <div style="text-align: center; padding: 4rem 1rem; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">
              <i class="fa-solid fa-shield-cat" style="font-size: 3.5rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
              <h4 style="font-weight: 800; color: #1e293b; margin: 0 0 0.4rem;">Không có sản phẩm nào đã giao để bảo hành</h4>
              <p style="color: #64748b; font-size: 0.88rem; max-width: 520px; margin: 0 auto 1.5rem;">
                Chỉ những đơn hàng đã giao thành công mới được kích hoạt bảo hành điện tử chính hãng từ 12 - 24 tháng theo số IMEI.
              </p>
              <button type="button" class="btn-shopee-secondary" onclick="document.getElementById('warranty-search-field').value=''; searchQuery=''; renderWarrantyView();">
                Xem lại danh sách
              </button>
            </div>
          ` : warranties.map(w => `
            <div class="tz-warranty-card ${w.isValid ? 'is-valid' : 'is-expired'}">
              <div class="twc-top">
                <img src="${w.item.image}" alt="${w.item.name}" class="twc-thumb">
                <div class="twc-info">
                  <h4 class="twc-name">${w.item.name}</h4>
                  <div class="twc-order-ref">
                    <span>Đơn hàng: <a href="tracking-detail.html?id=${encodeURIComponent(w.orderId)}">${w.orderId}</a></span>
                    <span class="twc-dot">•</span>
                    <span>Giao ngày: ${w.startDate}</span>
                    <span class="twc-dot">•</span>
                    <span>Thời hạn: <strong>${w.warrantyMonths} tháng</strong></span>
                  </div>
                  <div class="twc-identifiers">
                    <span class="id-pill" title="Số IMEI thiết bị">
                      <strong>IMEI:</strong> ${w.imei}
                    </span>
                    <span class="id-pill" title="Số Serial">
                      <strong>S/N:</strong> ${w.serial}
                    </span>
                  </div>
                </div>
                <div class="twc-status-col">
                  ${w.isValid ? `
                    <span class="twc-status-badge valid">
                      <i class="fa-solid fa-shield-halved"></i> Còn hạn bảo hành (còn ${w.daysRemaining} ngày)
                    </span>
                  ` : `
                    <span class="twc-status-badge expired">
                      <i class="fa-solid fa-circle-exclamation"></i> Hết hạn bảo hành
                    </span>
                  `}
                </div>
              </div>

              <div class="twc-bottom">
                <div class="twc-pkg-info">
                  <i class="fa-solid fa-award" style="color: #f59e0b;"></i>
                  <span>${w.warrantyType} (Hạn bảo hành: <strong>${w.expiryDate}</strong>)</span>
                </div>
                <div class="twc-actions">
                  <button type="button" class="btn-shopee-primary btn-claim-warranty-now" data-order-id="${w.orderId}">
                    <i class="fa-solid fa-screwdriver-wrench"></i> Yêu cầu bảo hành / Sửa chữa
                  </button>
                  <a href="tel:18006868" class="btn-shopee-secondary" title="Hotline hỗ trợ bảo hành miễn phí">
                    <i class="fa-solid fa-phone"></i> Hotline 1800.6868
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Bind tìm kiếm bảo hành
    const searchField = document.getElementById('warranty-search-field');
    const submitSearchBtn = document.getElementById('btn-submit-warranty-search');
    const clearSearchBtn = document.getElementById('btn-clear-warranty-search');

    if (submitSearchBtn && searchField) {
      submitSearchBtn.onclick = () => {
        searchQuery = searchField.value.trim();
        renderWarrantyView();
      };
      searchField.onkeydown = (e) => {
        if (e.key === 'Enter') {
          searchQuery = searchField.value.trim();
          renderWarrantyView();
        }
      };
    }

    if (clearSearchBtn) {
      clearSearchBtn.onclick = () => {
        searchQuery = '';
        renderWarrantyView();
      };
    }

    // Bind Nút Yêu cầu bảo hành / Sửa chữa
    container.querySelectorAll('.btn-claim-warranty-now').forEach(btn => {
      btn.onclick = () => {
        const orderId = btn.dataset.orderId;
        const targetOrder = Storage.findOrderById(orderId);
        if (targetOrder && targetOrder.items && targetOrder.items.length > 0) {
          const wInfo = WarrantyService.getWarrantyInfo(targetOrder, targetOrder.items[0]);
          openWarrantyClaimModal(wInfo);
        }
      };
    });
  }

  // Bind Shopee Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.status || 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      renderHistory();
    });
  });

  // Bind Search input on order tabs
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (currentFilter !== 'warranty') {
        renderHistory();
      }
    });
  }

  renderHistory();
}

// POPUP YÊU CẦU BẢO HÀNH / SỬA CHỮA THIẾT BỊ (HOTLINE 1800.6868 & GỬI CỬA HÀNG GẦN NHẤT)

// ==========================================================================
// KHO VOUCHER MODAL TOÀN CỤC (history.html & checkout.html)
// ==========================================================================
function openHistoryVoucherModal() {
  const currentUser = Auth.getUser();
  if (!currentUser) {
    showToast('Vui lòng đăng nhập để xem kho voucher ưu đãi của bạn!', 'warning', 'Tài khoản');
    return;
  }

  const modal = document.getElementById('voucherModal') || document.getElementById('tz-voucher-modal');
  if (!modal) return;

  const listContainer = modal.querySelector('#voucher-modal-list') || modal.querySelector('.voucher-modal-body');
  if (!listContainer) return;

  const userVouchers = VoucherService.getUserVouchers(currentUser);

  // Cập nhật số lượng trên badge nút Kho Voucher
  const headerBadge = document.getElementById('header-voucher-count');
  if (headerBadge) {
    const unused = userVouchers.filter(v => !v.isUsed).length;
    headerBadge.textContent = unused;
  }

  if (userVouchers.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: #64748b;">
        <i class="fa-solid fa-ticket" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 12px; display: block;"></i>
        <h4 style="font-size: 1.1rem; color: #1e293b; font-weight: 700; margin: 0 0 6px;">Ví voucher đang trống</h4>
        <p style="margin: 0; font-size: 0.88rem;">Hiện bạn chưa có mã giảm giá nào. Hãy tham gia các sự kiện để săn thêm deal hot!</p>
      </div>
    `;
  } else {
    listContainer.innerHTML = `
      <div class="voucher-modal-grid">
        ${userVouchers.map(v => {
          let discountText = '';
          if (v.discountType === 'percent') {
            discountText = `Giảm ${v.discountValue}%`;
            if (v.maxDiscount) discountText += ` (tối đa ${formatPrice(v.maxDiscount)})`;
          } else {
            discountText = `Giảm ${formatPrice(v.discountValue)}`;
          }

          const minOrderText = v.minOrder > 0 ? `Đơn tối thiểu: ${formatPrice(v.minOrder)}` : 'Đơn tối thiểu: 0đ';
          const isUsed = !!v.isUsed;

          return `
            <div class="tz-voucher-card-item ${isUsed ? 'is-used' : ''}">
              <div class="tz-vc-left" style="background: ${v.badgeColor || '#0284c7'};">
                <i class="fa-solid fa-ticket tz-vc-icon"></i>
                <span class="tz-vc-tag">${v.badgeText || (v.discountType === 'percent' ? `GIẢM ${v.discountValue}%` : 'VOUCHER')}</span>
              </div>
              <div class="tz-vc-content">
                <div class="tz-vc-header">
                  <span class="tz-vc-code">${escapeHtml(v.code)}</span>
                  <span class="tz-vc-type-badge">${isUsed ? 'Đã sử dụng' : 'Khả dụng'}</span>
                </div>
                <div class="tz-vc-title">${escapeHtml(v.title || discountText)}</div>
                <div class="tz-vc-condition"><i class="fa-solid fa-circle-info"></i> ${minOrderText}</div>
                <div class="tz-vc-expiry"><i class="fa-regular fa-clock"></i> HSD: ${escapeHtml(v.expiryDate || '31/12/2026')}</div>
              </div>
              <div class="tz-vc-action">
                ${isUsed ? `
                  <button type="button" class="btn-tz-vc-btn btn-used" disabled>Đã dùng</button>
                ` : `
                  <button type="button" class="btn-tz-vc-btn btn-copy" data-code="${escapeHtml(v.code)}" title="Sao chép mã vào bộ nhớ tạm">
                    <i class="fa-regular fa-copy"></i> Sao chép mã
                  </button>
                  <a href="products.html" class="btn-tz-vc-btn btn-use" title="Dùng khi mua sắm">
                    <i class="fa-solid fa-cart-shopping"></i> Dùng khi mua sắm
                  </a>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Bind Sao chép mã
    listContainer.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = btn.dataset.code;
        copyVoucherCode(code, btn);
      });
    });
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function copyVoucherCode(code, btn) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`Đã sao chép mã ${code} vào bộ nhớ tạm!`, 'success', 'Kho Voucher');
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Đã sao chép`;
        setTimeout(() => {
          btn.innerHTML = `<i class="fa-regular fa-copy"></i> Sao chép mã`;
        }, 2000);
      }
    }).catch(() => fallbackCopyCode(code, btn));
  } else {
    fallbackCopyCode(code, btn);
  }
}

function fallbackCopyCode(code, btn) {
  const tempInput = document.createElement('input');
  tempInput.value = code;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast(`Đã sao chép mã ${code}!`, 'success', 'Kho Voucher');
  if (btn) {
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Đã sao chép`;
    setTimeout(() => {
      btn.innerHTML = `<i class="fa-regular fa-copy"></i> Sao chép mã`;
    }, 2000);
  }
}

function closeVoucherModal() {
  const modal = document.getElementById('voucherModal') || document.getElementById('tz-voucher-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Global router for openVoucherModal()
function openVoucherModal() {
  // If on checkout page with dedicated checkout modal and items list
  if (document.getElementById('checkout-items-list') && typeof window.openCheckoutVoucherModal === 'function') {
    window.openCheckoutVoucherModal();
  } else {
    openHistoryVoucherModal();
  }
}

window.openVoucherModal = openVoucherModal;
window.closeVoucherModal = closeVoucherModal;
window.openHistoryVoucherModal = openHistoryVoucherModal;

// Đóng modal voucher khi click overlay bên ngoài
document.addEventListener('click', (e) => {
  const modal = document.getElementById('voucherModal');
  if (modal && e.target === modal) {
    closeVoucherModal();
  }
});

// Đóng modal khi bấm phím Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeVoucherModal();
  }
});

function openWarrantyClaimModal(wInfo) {
  if (!wInfo) return;

  let modal = document.getElementById('tz-warranty-claim-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'tz-modal-overlay';
    modal.id = 'tz-warranty-claim-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="tz-claim-modal-card">
        <div class="claim-modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="claim-header-icon"><i class="fa-solid fa-screwdriver-wrench"></i></div>
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; color: #1e293b; font-weight: 800;">Yêu Cầu Bảo Hành & Sửa Chữa</h3>
              <p style="margin: 0; font-size: 0.82rem; color: #64748b;">Hệ thống tiếp nhận bảo hành chính hãng TechZone Care+</p>
            </div>
          </div>
          <button type="button" class="btn-close-modal" id="btn-close-claim-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="claim-modal-body" id="claim-modal-content"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#btn-close-claim-modal').onclick = () => {
      modal.classList.remove('active');
    };
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove('active');
    };
  }

  const contentBox = modal.querySelector('#claim-modal-content');
  if (contentBox) {
    contentBox.innerHTML = `
      <div class="claim-cert-preview">
        <img src="${wInfo.item.image}" alt="${wInfo.item.name}" class="claim-device-thumb">
        <div>
          <h4 class="claim-device-title">${wInfo.item.name}</h4>
          <div class="claim-device-sub">
            <span>IMEI: <strong>${wInfo.imei}</strong></span> • 
            <span style="color: #059669; font-weight: 700;">${wInfo.statusText}</span>
          </div>
          <div style="font-size: 0.8rem; color: #64748b;">Đơn hàng: ${wInfo.orderId} • Hạn bảo hành: ${wInfo.expiryDate}</div>
        </div>
      </div>

      <div class="claim-methods-title">
        <i class="fa-solid fa-hand-holding-hand" style="color: #0284c7;"></i> Chọn hình thức gửi máy bảo hành tiện lợi nhất:
      </div>

      <div class="claim-options-grid">
        <div class="claim-opt-card active" id="opt-spx">
          <div class="opt-badge">KHUYÊN DÙNG</div>
          <div class="opt-icon"><i class="fa-solid fa-truck-fast"></i></div>
          <div class="opt-title">Bưu Tá Đến Lấy Máy Tận Nhà</div>
          <div class="opt-desc">Bưu tá Shopee Express (SPX) qua địa chỉ của bạn lấy máy niêm phong và gửi đến trung tâm bảo hành miễn phí 100%.</div>
        </div>

        <div class="claim-opt-card" id="opt-store">
          <div class="opt-icon"><i class="fa-solid fa-store"></i></div>
          <div class="opt-title">Gửi Trực Tiếp Cửa Hàng</div>
          <div class="opt-desc">Mang máy đến bất kỳ chi nhánh nào trong 86 trung tâm ủy quyền TechZone toàn quốc để được kỹ thuật viên hỗ trợ ngay.</div>
        </div>
      </div>

      <div class="claim-store-box">
        <div style="font-weight: 700; color: #1e293b; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-location-dot" style="color: #ea580c;"></i> Hệ thống trung tâm bảo hành chính:
        </div>
        <div style="font-size: 0.82rem; color: #475569; line-height: 1.5;">
          • <strong>Hà Nội:</strong> 128 Thái Hà, Đống Đa • ĐT: 1800.6868 (Bấm nhánh 2)<br>
          • <strong>TP. Hồ Chí Minh:</strong> 204 Nguyễn Thị Minh Khai, P.6, Quận 3<br>
          • <strong>Đà Nẵng:</strong> 56 Nguyễn Văn Linh, Q. Hải Châu
        </div>
      </div>

      <form id="claim-submit-form" style="margin-top: 14px;">
        <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">
          Mô tả lỗi hoặc triệu chứng máy gặp phải:
        </label>
        <textarea id="claim-desc" class="tz-input" rows="2" placeholder="Ví dụ: Máy không nhận sạc, pin báo ảo, màn hình có vệt sọc..." required style="width: 100%; box-sizing: border-box; font-size: 0.85rem; padding: 8px 10px; margin-bottom: 10px;"></textarea>
        
        <div style="display: flex; gap: 10px; align-items: center; justify-content: space-between;">
          <a href="tel:18006868" class="btn-shopee-secondary" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; font-size: 0.84rem; text-decoration: none;">
            <i class="fa-solid fa-phone"></i> Gọi tổng đài 1800.6868
          </a>
          <button type="submit" class="btn-shopee-primary" style="padding: 8px 18px; font-size: 0.84rem;">
            <i class="fa-solid fa-paper-plane"></i> Gửi yêu cầu tiếp nhận
          </button>
        </div>
      </form>
    `;

    // Bind option switch
    const optSpx = contentBox.querySelector('#opt-spx');
    const optStore = contentBox.querySelector('#opt-store');
    if (optSpx && optStore) {
      optSpx.onclick = () => {
        optSpx.classList.add('active');
        optStore.classList.remove('active');
      };
      optStore.onclick = () => {
        optStore.classList.add('active');
        optSpx.classList.remove('active');
      };
    }

    // Bind submit form
    const form = contentBox.querySelector('#claim-submit-form');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const desc = contentBox.querySelector('#claim-desc')?.value.trim();
        showToast('Yêu cầu bảo hành đã được tiếp nhận thành công! Chuyên viên kỹ thuật sẽ gọi lại trong 15 phút.', 'success', 'Tiếp nhận bảo hành');
        modal.classList.remove('active');
      };
    }
  }

  modal.classList.add('active');
}


// Quick Timeline Modal logic on history.html
function openHistoryTimelineModal(orderId) {
  const modalContainer = document.getElementById('history-timeline-modal-container');
  if (!modalContainer) {
    window.location.href = `tracking-detail.html?id=${encodeURIComponent(orderId)}`;
    return;
  }

  const order = Storage.findOrderById(orderId) || Storage.getOrders()[0];
  if (!order) return;

  const steps = [
    { name: 'Đơn Đã Đặt', time: order.createdAt },
    { name: 'Đã Xác Nhận', time: order.status !== 'Đã đặt' ? 'Đã đóng hộp SPX' : 'Chờ xác nhận' },
    { name: 'Đang Vận Chuyển', time: (order.status === 'Đang giao' || order.status === 'Đã giao' || order.status === 'Giao thành công') ? 'Đang giao hỏa tốc' : 'Chờ xuất kho' },
    { name: 'Giao Thành Công', time: (order.status === 'Đã giao' || order.status === 'Giao thành công') ? 'Đã ký nhận' : 'Dự kiến hôm nay' }
  ];

  let activeIdx = 0;
  if (order.status === 'Chờ xác nhận' || order.status === 'Đã xác nhận') activeIdx = 1;
  else if (order.status === 'Đang giao') activeIdx = 2;
  else if (order.status === 'Đã giao' || order.status === 'Giao thành công') activeIdx = 3;
  else if (order.status === 'Đã hủy') activeIdx = -1;

  let progressPct = 0;
  if (activeIdx === 1) progressPct = 33.33;
  if (activeIdx === 2) progressPct = 66.66;
  if (activeIdx === 3) progressPct = 100;

  const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;

  modalContainer.innerHTML = `
    <div class="tz-timeline-modal-backdrop" id="timeline-modal-backdrop">
      <div class="tz-timeline-modal-card" onclick="event.stopPropagation()">
        <div class="tz-modal-header">
          <h3>
            <i class="fa-solid fa-bolt" style="color: #ee4d2d;"></i>
            Tiến Trình Đơn Hàng #${order.id}
          </h3>
          <button type="button" class="tz-modal-close-btn" id="btn-close-timeline-modal" title="Đóng popup">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="tz-modal-body">
          <!-- Mini Product Overview -->
          ${firstItem ? `
            <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: #f8fafc; border-radius: 8px; margin-bottom: 1.25rem; border: 1px solid #e2e8f0;">
              <img src="${firstItem.image}" alt="${firstItem.name}" style="width: 52px; height: 52px; border-radius: 6px; object-fit: contain; background: white; padding: 2px;">
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 700; font-size: 0.9rem; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${firstItem.name}</div>
                <div style="font-size: 0.78rem; color: #64748b;">${firstItem.variant || 'Chính hãng'} | Tổng tiền: <strong style="color: #ee4d2d;">${formatVND(order.total)}</strong></div>
              </div>
            </div>
          ` : ''}

          <!-- 4-step Timeline or Cancelled Notice -->
          ${order.status === 'Đã hủy' ? `
            <div class="order-timeline modal-mode timeline-cancelled" style="margin: 0.5rem 0 1rem 0;">
              <div class="order-cancelled-notice-card" style="margin: 0;">
                <div class="cancelled-icon-badge">
                  <i class="fa-solid fa-ban"></i>
                </div>
                <h4 class="cancelled-title">Đơn hàng này đã được hủy bỏ</h4>
                <div class="cancelled-reason-pill">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  Lý do hủy: <strong>${order.cancelReason || 'Người mua yêu cầu hủy đơn'}</strong>
                </div>
                ${order.cancelDate ? `<div class="cancelled-date-text"><i class="fa-regular fa-clock"></i> Thời gian ghi nhận: ${order.cancelDate}</div>` : ''}
                <p class="cancelled-desc">
                  Đơn hàng đã hoàn tất thủ tục hủy. Bạn có thể chọn lại sản phẩm vào giỏ để tiếp tục đặt hàng khi có nhu cầu.
                </p>
              </div>
            </div>
          ` : `
          <div class="order-timeline modal-mode" style="--progress-width: ${progressPct}%;">
            ${steps.map((st, idx) => {
              const isPast = activeIdx >= idx;
              const isCurrent = activeIdx === idx;
              return `
                <div class="timeline-step ${isPast ? 'active' : ''} ${isCurrent ? 'current' : ''}">
                  <div class="timeline-dot">
                    <i class="fa-solid ${isPast ? 'fa-check' : 'fa-circle'}"></i>
                  </div>
                  <div class="timeline-text-content">
                    <div class="timeline-step-name">${st.name}</div>
                    <div class="timeline-step-time">${st.time}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          `}

          <!-- Shipper info if active delivery, or Warehouse notice if preparing -->
          ${((order.status === 'Đang giao' || order.status === 'Đang vận chuyển') && order.shipper) ? `
            <div class="tz-modal-shipper-card" style="margin-top: 1.25rem; padding: 12px 14px; background: #fffbf8; border: 1px solid #fed7aa; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${order.shipper.avatar}" alt="${order.shipper.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #ee4d2d;">
                <div>
                  <div style="font-weight: 700; font-size: 0.88rem; color: #1e293b;">Bưu tá: ${order.shipper.name} (${order.shipper.rating})</div>
                  <div style="font-size: 0.78rem; color: #64748b;">Biển số: <strong>${order.shipper.plate}</strong> | ĐT: <strong>${order.shipper.phone}</strong></div>
                </div>
              </div>
              <a href="tel:${order.shipper.phone}" class="btn-shopee-primary" style="padding: 5px 12px; font-size: 0.78rem;">
                <i class="fa-solid fa-phone"></i> Gọi ngay
              </a>
            </div>
          ` : (order.status !== 'Đã hủy' && order.status !== 'Đã giao') ? `
            <div class="tz-modal-warehouse-notice" style="margin-top: 1.25rem; padding: 11px 14px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; gap: 10px; color: #475569; font-size: 0.82rem;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #e0f2fe; display: flex; align-items: center; justify-content: center; color: #0284c7; font-size: 0.95rem; flex-shrink: 0;">
                <i class="fa-solid fa-boxes-packing"></i>
              </div>
              <div>
                <span style="font-weight: 700; color: #1e293b;">Đang chuẩn bị kiện hàng:</span>
                <span style="display: block; color: #64748b; font-size: 0.78rem; margin-top: 2px;">Kiện hàng đang được chuẩn bị tại kho, chưa bàn giao cho tài xế.</span>
              </div>
            </div>
          ` : ''}

          <!-- Checkpoints log -->
          <div style="margin-top: 1.25rem;">
            <div style="font-size: 0.82rem; font-weight: 700; color: #475569; margin-bottom: 8px; text-transform: uppercase;">
              <i class="fa-solid fa-list-check" style="color: #ee4d2d;"></i> Nhật ký di chuyển gần nhất:
            </div>
            <div class="spx-vertical-timeline modal-vert">
              ${(order.checkpoints || []).slice(0, 3).map((cp, idx) => `
                <div class="spx-vert-step ${idx === 0 ? 'current' : ''}">
                  <div class="spx-vert-dot"></div>
                  <div class="spx-vert-content">
                    <div class="spx-vert-time">${cp.time}</div>
                    <div class="spx-vert-desc">${cp.text}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="tz-modal-footer">
          <button type="button" class="btn-shopee-secondary" id="btn-modal-dismiss" style="padding: 7px 16px;">Đóng</button>
          <a href="tracking-detail.html?id=${order.id}" class="btn-shopee-primary" style="padding: 7px 18px;">
            <i class="fa-solid fa-up-right-from-square"></i> Mở toàn trang tracking chi tiết
          </a>
        </div>
      </div>
    </div>
  `;

  const backdrop = document.getElementById('timeline-modal-backdrop');
  const closeBtn = document.getElementById('btn-close-timeline-modal');
  const dismissBtn = document.getElementById('btn-modal-dismiss');

  function closeModal() {
    if (modalContainer) modalContainer.innerHTML = '';
  }

  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  });
}

// --- 10. LOCATION SELECTOR (CUSTOM DROPDOWN & MODAL) ---
const CITIES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Đồng Nai'];
const LOCATION_STORAGE_KEY = 'selectedLocation';

/**
 * Hàm đóng modal bao quát mọi thẻ bọc và backdrop liên quan
 */
function closeLocationModal() {
  // Tìm tất cả các thẻ liên quan đến modal và backdrop
  const targets = document.querySelectorAll(
    '.location-modal, .province-modal, .location-bottom-sheet, .province-select-popup, .location-overlay, .modal-backdrop, .tz-location-dropdown, .location-dropdown, .location-menu, .tz-location-sheet, .location-sheet, .tz-location-backdrop, .location-backdrop, .modal-location-overlay, .location-modal-backdrop'
  );
  targets.forEach(el => {
    el.classList.remove('active', 'show', 'open');
    el.style.setProperty('display', 'none', 'important');
  });

  // Reset các nút trigger trên Topbar
  document.querySelectorAll('.tz-location-badge, #btn-select-location, .tz-location-btn').forEach(btn => {
    btn.classList.remove('open', 'active');
    btn.setAttribute('aria-expanded', 'false');
  });

  // Gỡ bỏ class khóa/ẩn trạng thái modal trên body
  document.body.classList.remove('location-modal-open', 'tz-location-open');
}

// Alias tương thích ngược
const closeAllLocationDropdowns = closeLocationModal;

/**
 * Hàm xử lý chọn tỉnh thành khu vực nhận hàng (Location Picker)
 * @param {string} provinceName Tên tỉnh/thành được chọn (ví dụ: 'Đà Nẵng')
 * @param {boolean} showToastFlag Có hiển thị thông báo Toast hay không (mặc định: true)
 */
function selectLocation(provinceName, showToastFlag = true) {
  if (!provinceName || typeof provinceName !== 'string') return;
  const cleanName = provinceName.trim();
  if (!cleanName) return;

  // 1. Lưu tỉnh đã chọn vào localStorage
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, cleanName);
  } catch (err) {
    console.warn('LocalStorage error saving location:', err);
  }

  // 2. Cập nhật nội dung hiển thị của nút vị trí trên Topbar (thay thế chữ "Hà Nội" bằng provinceName)
  document.querySelectorAll('.tz-location-name, .location-name, #selected-location, .current-location-text').forEach(el => {
    el.textContent = cleanName;
  });

  // 3. Di chuyển icon tích xanh (✓) sang đúng dòng vừa được chọn & cập nhật class active
  document.querySelectorAll('.tz-location-item, .location-item, .location-option').forEach(item => {
    const itemCity = item.getAttribute('data-city') || item.dataset.city || (item.querySelector('.tz-city-name, .city-name') ? item.querySelector('.tz-city-name, .city-name').textContent.trim() : item.textContent.trim());
    const isSelected = (itemCity === cleanName || itemCity.includes(cleanName) || cleanName.includes(itemCity));

    if (isSelected) {
      item.classList.add('active');
      item.setAttribute('aria-selected', 'true');
      let checkIcon = item.querySelector('.tz-city-check, .city-check, .fa-check');
      if (!checkIcon) {
        checkIcon = document.createElement('i');
        checkIcon.className = 'fa-solid fa-check tz-city-check';
        item.appendChild(checkIcon);
      }
      checkIcon.style.display = 'inline-block';
    } else {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
      let checkIcon = item.querySelector('.tz-city-check, .city-check, .fa-check');
      if (checkIcon) {
        checkIcon.style.display = 'none';
      }
    }
  });

  // 4. BẮT BUỘC gọi closeLocationModal() để đóng Modal/Dropdown ngay lập tức
  closeLocationModal();

  // 5. Hiển thị thông báo Toast nếu được yêu cầu
  if (showToastFlag && typeof showToast === 'function') {
    showToast('Đã chuyển khu vực mua sắm sang: <strong>' + cleanName + '</strong>', 'success', 'Cập nhật khu vực');
  }
}

// Expose toàn cục để gọi từ HTML onclick và các module khác
window.closeLocationModal = closeLocationModal;
window.closeAllLocationDropdowns = closeLocationModal;
window.selectLocation = selectLocation;
if (typeof TZ !== 'undefined') {
  TZ.closeLocationModal = closeLocationModal;
  TZ.closeAllLocationDropdowns = closeLocationModal;
  TZ.selectLocation = selectLocation;
}

/**
 * Khởi tạo Location Selector & tự động đồng bộ từ localStorage khi tải trang
 */
function initLocationSelector() {
  // Đọc localStorage.getItem('selectedLocation'). Nếu đã từng chọn, tự động hiển thị tên tỉnh đó lên Topbar
  let savedCity = 'Hà Nội';
  try {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (stored && stored.trim()) {
      savedCity = stored.trim();
    } else {
      localStorage.setItem(LOCATION_STORAGE_KEY, savedCity);
    }
  } catch (err) {
    savedCity = 'Hà Nội';
  }

  // Tự động đồng bộ vị trí khi tải trang (không hiện Toast khi load)
  selectLocation(savedCity, false);

  // Tự động bổ sung nút đóng (✕) vào header bảng chọn khu vực nếu chưa có
  document.querySelectorAll('.tz-location-dropdown, .location-dropdown, .location-menu, .location-modal, .location-sheet').forEach(dd => {
    const header = dd.querySelector('.tz-dropdown-header, .location-header, .location-modal-header, .location-sheet-header');
    if (header && !header.querySelector('.tz-location-close-btn, .location-close-btn, .btn-close-location')) {
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'tz-location-close-btn location-modal-close';
      closeBtn.setAttribute('aria-label', 'Đóng chọn khu vực');
      closeBtn.setAttribute('onclick', 'closeLocationModal()');
      closeBtn.innerHTML = '&times;';
      header.appendChild(closeBtn);
    }
  });

  function showMobileBackdrop() {
    if (window.innerWidth <= 768) {
      let backdrop = document.getElementById('tz-location-backdrop') || document.querySelector('.tz-location-backdrop, .location-backdrop, .location-overlay, .modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'tz-location-backdrop';
        backdrop.className = 'tz-location-backdrop location-backdrop location-overlay modal-backdrop';
        document.body.appendChild(backdrop);
      }
      backdrop.setAttribute('onclick', 'closeLocationModal()');
      backdrop.style.removeProperty('display');
      backdrop.classList.add('active', 'show', 'open');
      backdrop.style.display = 'block';
      document.body.classList.add('location-modal-open', 'tz-location-open');
    }
  }

  // Event Delegation gắn trên document
  document.addEventListener('click', function(e) {
    // 0. Click nút đóng (✕)
    if (e.target.closest('.tz-location-close-btn, .location-close-btn, .btn-close-location, .location-modal-close')) {
      e.preventDefault();
      e.stopPropagation();
      closeLocationModal();
      return;
    }

    // 1. Click chọn item tỉnh/thành (fallback nếu không có onclick)
    const item = e.target.closest('.tz-location-item, .location-item, .location-option');
    if (item) {
      e.preventDefault();
      e.stopPropagation();

      let city = item.getAttribute('data-city') || item.dataset.city;
      if (!city) {
        const nameEl = item.querySelector('.tz-city-name, .city-name');
        city = (nameEl ? nameEl.textContent : item.textContent).trim();
      }
      if (city) {
        for (const c of CITIES) {
          if (city.includes(c)) {
            city = c;
            break;
          }
        }
        selectLocation(city, true);
      }
      return;
    }

    // 2. Click nút mở/đóng menu vị trí trên Topbar:
    const badgeBtn = e.target.closest('.tz-location-badge, #btn-select-location, .tz-location-btn');
    if (badgeBtn) {
      e.preventDefault();
      e.stopPropagation();

      const wrapper = badgeBtn.closest('.tz-location-wrapper') || badgeBtn.parentElement;
      const dropdown = wrapper ? wrapper.querySelector('.tz-location-dropdown, .location-dropdown, .location-menu, .location-modal, .location-sheet, .location-bottom-sheet') : document.querySelector('.tz-location-dropdown, .location-modal');
      if (!dropdown) return;

      const isOpen = (dropdown.classList.contains('show') || dropdown.classList.contains('active')) && dropdown.style.display !== 'none';

      if (isOpen) {
        closeLocationModal();
      } else {
        closeLocationModal(); // Đóng các modal khác nếu có
        dropdown.style.removeProperty('display');
        dropdown.classList.add('show', 'active', 'open');
        badgeBtn.classList.add('open');
        badgeBtn.setAttribute('aria-expanded', 'true');
        showMobileBackdrop();
      }
      return;
    }

    // 3. Click ra ngoài khung tự động đóng menu
    if (!e.target.closest('.tz-location-wrapper') && !e.target.closest('.tz-location-dropdown') && !e.target.closest('.location-menu') && !e.target.closest('.location-dropdown') && !e.target.closest('.location-modal-content') && !e.target.closest('.location-sheet') && !e.target.closest('.tz-location-badge') && !e.target.closest('#btn-select-location')) {
      closeLocationModal();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLocationModal();
    }
  });
}

// --- 11. CATEGORY DROPDOWN (MEGA MENU) LOGIC ---
function initCategoryDropdown() {
  const toggleBtn = document.getElementById('header-category-toggle');
  const dropdown = document.getElementById('header-category-dropdown');

  if (!toggleBtn || !dropdown) return;

  function closeMenu() {
    dropdown.classList.remove('show');
    toggleBtn.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    dropdown.classList.add('show');
    toggleBtn.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropdown.classList.contains('show')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Click vào item trong Menu danh mục
  const categoryItems = dropdown.querySelectorAll('.tz-category-menu-item');
  categoryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const categoryKey = item.dataset.category;
      if (!categoryKey) return;

      const isProductsPage = window.location.pathname.toLowerCase().includes('products') || !!document.getElementById('catalog-products-grid');

      if (isProductsPage) {
        // Nếu người dùng đang ở trang products.html và click tiếp vào Menu Danh mục: lọc động ngay lập tức mà không cần reload trang
        e.preventDefault();
        closeMenu();
        if (typeof window.applyCategoryFilter === 'function') {
          window.applyCategoryFilter(categoryKey, true);
        }
      } else {
        // Khi ở trang chủ (index.html): Click vào danh mục sẽ chuyển hướng sang products.html?category=[tên_category] và đóng menu
        closeMenu();
        // Thẻ <a> mặc định điều hướng tới products.html?category=...
      }
    });
  });

  // Footer "Xem toàn bộ sản phẩm" trong dropdown
  const footerLink = dropdown.querySelector('.tz-category-dropdown-footer a');
  if (footerLink) {
    footerLink.addEventListener('click', (e) => {
      const isProductsPage = window.location.pathname.toLowerCase().includes('products') || !!document.getElementById('catalog-products-grid');
      if (isProductsPage) {
        e.preventDefault();
        closeMenu();
        if (typeof window.applyCategoryFilter === 'function') {
          window.applyCategoryFilter('all', true);
        }
      } else {
        closeMenu();
      }
    });
  }

  // Click ra ngoài vùng menu sẽ tự động đóng lại (Click outside to close)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tz-category-wrapper')) {
      closeMenu();
    }
  });

  // Phím ESC để đóng menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
}

// --- 12. STICKY HEADER SCROLL OBSERVER ---
function initStickyHeader() {
  const header = document.querySelector('.tz-header');
  if (!header) return;

  let ticking = false;
  const updateSticky = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY > 10) {
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateSticky);
      ticking = true;
    }
  }, { passive: true });

  updateSticky();
}

// --- 13. USER AUTHENTICATION & ACCOUNT LOGIC ---
const Auth = {
  STORAGE_USERS_KEY: 'registeredUsers',
  STORAGE_CURRENT_KEY: 'currentUser',

  // Tài khoản mẫu mặc định
  DEFAULT_ADMIN: {
    username: "admin",
    email: "admin@gmail.com",
    fullname: "Quản trị viên TechZone",
    password: "123",
    addresses: [
      {
        id: "addr_admin_1",
        recipientName: "Quản trị viên TechZone",
        phone: "0988.123.456",
        city: "Hà Nội",
        detailAddress: "Tầng 5, Tòa nhà TechZone Tower, 18 Phố Huế, P. Hàng Bài, Hoàn Kiếm",
        isDefault: true
      },
      {
        id: "addr_admin_2",
        recipientName: "Quản trị viên TechZone (Kho HN)",
        phone: "0912.345.678",
        city: "Hà Nội",
        detailAddress: "Kho trung chuyển SPX, 68 Duy Tân, P. Dịch Vọng Hậu, Cầu Giấy",
        isDefault: false
      }
    ]
  },

  // Lấy danh sách tài khoản đã đăng ký (khởi tạo tài khoản admin mẫu nếu trống)
  getRegisteredUsers() {
    try {
      const raw = localStorage.getItem(this.STORAGE_USERS_KEY);
      let users = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(users) || users.length === 0) {
        users = [{ ...this.DEFAULT_ADMIN }];
        localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(users));
      } else {
        const hasAdmin = users.some(u => (u.username === 'admin') || (u.email && u.email.toLowerCase() === 'admin@gmail.com'));
        if (!hasAdmin) {
          users.unshift({ ...this.DEFAULT_ADMIN });
          localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(users));
        }
      }
      return users;
    } catch (e) {
      const fallback = [{ ...this.DEFAULT_ADMIN }];
      localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(fallback));
      return fallback;
    }
  },

  // Đăng ký người dùng mới
  registerUser(fullname, email, password, phone = '') {
    const users = this.getRegisteredUsers();
    const cleanEmail = email.trim().toLowerCase();

    // Kiểm tra xem Email đã tồn tại chưa
    const exists = users.some(u => 
      (u.email && u.email.toLowerCase() === cleanEmail) || 
      (u.username && u.username.toLowerCase() === cleanEmail)
    );

    if (exists) {
      return { success: false, message: 'Email này đã được đăng ký!' };
    }

    const newUser = {
      username: cleanEmail.split('@')[0],
      email: cleanEmail,
      fullname: fullname.trim(),
      phone: phone.trim(),
      password: String(password),
      gender: 'nam',
      birthday: '',
      city: '',
      district: '',
      addressDetail: '',
      avatar: '',
      provider: 'local',
      registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(users));
    return { success: true, user: newUser };
  },

  // Kiểm tra đăng nhập đối chiếu với 'registeredUsers'
  login(account, password) {
    const users = this.getRegisteredUsers();
    const cleanAccount = account.trim().toLowerCase();
    const strPass = String(password).trim();

    const matched = users.find(u => {
      const matchEmail = u.email && u.email.toLowerCase() === cleanAccount;
      const matchUsername = u.username && u.username.toLowerCase() === cleanAccount;
      return (matchEmail || matchUsername) && String(u.password).trim() === strPass;
    });

    if (!matched) {
      return {
        success: false,
        message: 'Tài khoản hoặc mật khẩu không chính xác! Vui lòng đăng ký tài khoản trước.'
      };
    }

    // Đăng nhập thành công -> Lưu vào 'currentUser'
    this.setCurrentUser(matched);
    return { success: true, user: matched };
  },

  // Lấy người dùng hiện tại
  getUser() {
    try {
      const raw = localStorage.getItem(this.STORAGE_CURRENT_KEY) || localStorage.getItem('techzone_current_user');
      if (raw) {
        const user = JSON.parse(raw);
        if (user && (user.fullname || user.name)) {
          if (!user.fullname && user.name) user.fullname = user.name;
          return user;
        }
      }
      const legacyName = localStorage.getItem('userName');
      if (legacyName) {
        return { fullname: legacyName, name: legacyName, email: '', username: '' };
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  // Lưu phiên đăng nhập
  setCurrentUser(userData) {
    const fullname = userData.fullname || userData.name || 'Người dùng TechZone';
    const email = userData.email || '';
    const username = userData.username || (email ? email.split('@')[0] : 'user');

    const normalized = {
      username: username,
      email: email,
      fullname: fullname,
      name: fullname,
      phone: userData.phone || '',
      gender: userData.gender || 'nam',
      birthday: userData.birthday || '',
      city: userData.city || '',
      district: userData.district || '',
      addressDetail: userData.addressDetail || '',
      avatar: userData.avatar || '',
      password: userData.password || '',
      provider: userData.provider || 'local',
      points: userData.points !== undefined ? userData.points : 0,
      totalSpent: userData.totalSpent !== undefined ? userData.totalSpent : 0,
      ordersCount: userData.ordersCount !== undefined ? userData.ordersCount : 0,
      rank: userData.rank || 'Smember Tiêu chuẩn',
      loginAt: userData.loginAt || new Date().toISOString(),
      addresses: Array.isArray(userData.addresses) ? userData.addresses : (userData.addresses ? [userData.addresses] : [])
    };

    localStorage.setItem(this.STORAGE_CURRENT_KEY, JSON.stringify(normalized));
    localStorage.setItem('techzone_current_user', JSON.stringify(normalized));
    localStorage.setItem('userName', fullname);
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem(this.STORAGE_CURRENT_KEY);
    localStorage.removeItem('techzone_current_user');
    localStorage.removeItem('userName');
  },

  // --- QUẢN LÝ SỔ ĐỊA CHỈ NHẬN HÀNG (ADDRESS BOOK HELPERS) ---
  getUserAddresses(user = null) {
    const u = user || this.getUser();
    if (!u) return [];
    if (Array.isArray(u.addresses) && u.addresses.length > 0) {
      return u.addresses;
    }
    // Tự động tạo địa chỉ mặc định đầu tiên từ thông tin tài khoản hiện có
    const defaultAddr = {
      id: 'addr_' + Date.now(),
      recipientName: u.fullname || u.name || 'Người dùng TechZone',
      phone: u.phone || '0988.123.456',
      city: u.city || 'Hà Nội',
      detailAddress: u.addressDetail || 'Số 18 Phố Huế, P. Hàng Bài, Q. Hoàn Kiếm',
      isDefault: true
    };
    u.addresses = [defaultAddr];
    this.updateUser(u);
    return u.addresses;
  },

  getDefaultAddress(user = null) {
    const addrs = this.getUserAddresses(user);
    if (!addrs || addrs.length === 0) return null;
    const def = addrs.find(a => a.isDefault);
    return def || addrs[0];
  },

  addAddress(addressData, setAsDefault = false) {
    const user = this.getUser();
    if (!user) return null;
    if (!Array.isArray(user.addresses)) {
      user.addresses = [];
    }
    const isFirst = user.addresses.length === 0;
    const shouldBeDefault = setAsDefault || isFirst;

    if (shouldBeDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    const newAddr = {
      id: addressData.id || ('addr_' + Date.now() + '_' + Math.floor(Math.random() * 1000)),
      recipientName: addressData.recipientName.trim(),
      phone: addressData.phone.trim(),
      city: addressData.city || 'Hà Nội',
      detailAddress: addressData.detailAddress.trim(),
      isDefault: shouldBeDefault
    };

    user.addresses.unshift(newAddr);
    this.updateUser(user);
    return newAddr;
  },

  setDefaultAddress(addrId) {
    const user = this.getUser();
    if (!user || !Array.isArray(user.addresses)) return false;
    user.addresses.forEach(a => {
      a.isDefault = (a.id === addrId);
    });
    this.updateUser(user);
    return true;
  },

  deleteAddress(addrId) {
    const user = this.getUser();
    if (!user || !Array.isArray(user.addresses)) return false;
    const wasDefault = user.addresses.some(a => a.id === addrId && a.isDefault);
    user.addresses = user.addresses.filter(a => a.id !== addrId);
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    this.updateUser(user);
    return true;
  },

  updateUser(updatedUser) {
    this.setCurrentUser(updatedUser);
    const users = this.getRegisteredUsers();
    const uEmail = (updatedUser.email || '').toLowerCase().trim();
    const uName = (updatedUser.username || '').toLowerCase().trim();
    const idx = users.findIndex(u => 
      (uEmail && u.email && u.email.toLowerCase() === uEmail) || 
      (uName && u.username && u.username.toLowerCase() === uName)
    );
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updatedUser };
      localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(users));
    }
  }
};

// --- CUSTOM MODAL ĐĂNG XUẤT CHÍNH GIỮA MÀN HÌNH (CENTER MODAL DIALOG) ---
function openLogoutModal() {
  let modal = document.getElementById('tz-logout-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'tz-modal-overlay';
    modal.id = 'tz-logout-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'tz-logout-title');
    modal.innerHTML = `
      <div class="tz-modal-content">
        <div class="tz-modal-icon-badge">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </div>
        <h3 class="tz-modal-title" id="tz-logout-title">Xác nhận đăng xuất</h3>
        <p class="tz-modal-desc">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?</p>
        <div class="tz-modal-btn-group">
          <button type="button" class="tz-btn-modal-cancel" id="tz-btn-cancel-logout">Hủy bỏ</button>
          <button type="button" class="tz-btn-modal-logout" id="tz-btn-confirm-logout">Đăng xuất</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Đóng khi click vào lớp nền mờ ngoài hộp thoại
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeLogoutModal();
    }
  };

  const cancelBtn = modal.querySelector('#tz-btn-cancel-logout');
  if (cancelBtn) {
    cancelBtn.onclick = (e) => {
      e.preventDefault();
      closeLogoutModal();
    };
  }

  const confirmBtn = modal.querySelector('#tz-btn-confirm-logout');
  if (confirmBtn) {
    confirmBtn.onclick = (e) => {
      e.preventDefault();
      executeLogout();
    };
  }

  modal.classList.add('show');
}

function closeLogoutModal() {
  const modal = document.getElementById('tz-logout-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

function executeLogout() {
  // 1. Xóa phiên đăng nhập khỏi localStorage
  Auth.logout();

  // 2. Đóng modal xác nhận
  closeLogoutModal();

  // 3. Đóng dropdown tài khoản trên header nếu đang mở
  const userDropdown = document.getElementById('tz-user-dropdown');
  if (userDropdown) {
    userDropdown.classList.remove('show');
  }

  // 4. Cập nhật giao diện về nút Đăng nhập, Reset badge giỏ hàng về 0 & Ẩn Live Tracking Widget
  initUserAccount();
  Storage.updateCartBadge();
  initSmartOrderBanner();

  // Chặn người dùng chưa đăng nhập truy cập Giỏ hàng hoặc Đơn mua trên Header
  const cartBtn = document.querySelector('.tz-cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      const user = Auth.getUser();
      if (!user) {
        e.preventDefault();
        showToast('Vui lòng đăng nhập để xem giỏ hàng và mua sắm!', 'warning', 'Yêu cầu đăng nhập');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1000);
      }
    });
  }

  const orderBtns = document.querySelectorAll('a[href="history.html"]');
  orderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const user = Auth.getUser();
      if (!user) {
        e.preventDefault();
        showToast('Vui lòng đăng nhập để xem lịch sử đơn mua của bạn!', 'warning', 'Yêu cầu đăng nhập');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1000);
      }
    });
  });

  // 5. Hiển thị Toast thông báo
  showToast('Đã đăng xuất tài khoản', 'info', 'Đăng xuất thành công');

  // 6. Nếu đang ở các trang yêu cầu đăng nhập (checkout, history, profile, complete-profile), điều hướng về login.html
  // Đặc biệt: Nếu đang ở vouchers.html, chuyển hướng trực tiếp về index.html (theo yêu cầu)
  const pathname = window.location.pathname.toLowerCase();
  if (pathname.includes('voucher')) {
    if (typeof showPageLoader === 'function') {
      showPageLoader();
    }
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 300);
  } else if (pathname.includes('checkout') || pathname.includes('history') || pathname.includes('profile')) {
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 400);
  }
}

// ==========================================================================
// AUTHENTIC OAUTH SOCIAL LOGIN MODALS (GOOGLE, FACEBOOK, ZALO, APPLE)
// ==========================================================================

// Đóng toàn bộ các Popup Đăng nhập Mạng xã hội
function closeAllSocialModals() {
  const modals = document.querySelectorAll('#tz-google-modal, #googleLoginModal, #tz-facebook-modal, #tz-zalo-modal, #tz-apple-modal, .google-modal-backdrop, .google-one-tap');
  modals.forEach(m => {
    m.classList.remove('show', 'active');
    m.style.display = 'none';
  });
}

// Kiểm tra và vô hiệu hóa triệt để bất kỳ popup đăng nhập tự động nào khi đã có currentUser
function guardGoogleLoginModals() {
  const hasUser = !!(localStorage.getItem('currentUser') || localStorage.getItem('techzone_current_user'));
  if (hasUser) {
    closeAllSocialModals();
  }
  // Vô hiệu hóa bất kỳ hàm onscroll nào cố gọi modal đăng nhập khi chạm đáy footer
  if (window.onscroll && typeof window.onscroll === 'function') {
    const fnStr = window.onscroll.toString().toLowerCase();
    if (fnStr.includes('google') || fnStr.includes('modal') || fnStr.includes('login') || fnStr.includes('onetap')) {
      window.onscroll = null;
    }
  }
}
window.guardGoogleLoginModals = guardGoogleLoginModals;

// Hàm cốt lõi: Xử lý Đăng nhập qua Mạng xã hội & Đồng bộ dữ liệu
function loginWithSocialPlatform(provider, fullname, email, extra = {}) {
  const cleanName = (fullname || '').trim() || `Người dùng ${provider}`;
  const cleanEmail = (email || '').trim().toLowerCase() || `${provider.toLowerCase()}_user@gmail.com`;

  // Tạo avatar đại diện tương ứng với màu sắc và nhận diện của từng nền tảng
  let avatar = extra.avatar || '';
  if (!avatar) {
    if (provider === 'Google') {
      avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=ea4335,4285f4,fbbc05,34a853`;
    } else if (provider === 'Facebook') {
      avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=1877f2`;
    } else if (provider === 'Zalo') {
      avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=0068ff`;
    } else if (provider === 'Apple') {
      avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=1c1c1e`;
    }
  }

  // 1. Tự động đăng ký và lưu người dùng này vào danh sách 'registeredUsers'
  const users = Auth.getRegisteredUsers();
  let user = users.find(u => (u.email && u.email.toLowerCase() === cleanEmail) || (u.username && u.username.toLowerCase() === cleanEmail));
  if (!user) {
    user = {
      username: cleanEmail.split('@')[0],
      email: cleanEmail,
      fullname: cleanName,
      phone: extra.phone || '',
      provider: provider,
      avatar: avatar,
      password: '',
      gender: 'nam',
      birthday: '',
      city: '',
      district: '',
      addressDetail: '',
      registeredAt: new Date().toISOString()
    };
    users.push(user);
    localStorage.setItem(Auth.STORAGE_USERS_KEY, JSON.stringify(users));
  } else {
    user.fullname = cleanName;
    user.provider = provider;
    if (extra.phone) user.phone = extra.phone;
    if (avatar) user.avatar = avatar;
    localStorage.setItem(Auth.STORAGE_USERS_KEY, JSON.stringify(users));
  }

  // 2. Lưu phiên đăng nhập vào 'currentUser'
  Auth.setCurrentUser({
    username: user.username || cleanEmail.split('@')[0],
    email: cleanEmail,
    fullname: cleanName,
    phone: user.phone || extra.phone || '',
    avatar: avatar,
    provider: provider
  });

  // 3. Đóng toàn bộ Popup
  closeAllSocialModals();

  // 4. Lưu thông báo Toast flash
  const welcomeMsg = `Đăng nhập thành công qua <strong>${provider}</strong>! Chào bạn <strong>${cleanName}</strong>.`;
  sessionStorage.setItem('techzone_toast_flash', JSON.stringify({
    title: `Đăng nhập ${provider} thành công!`,
    message: welcomeMsg,
    type: 'success'
  }));

  // 5. Điều hướng: Nếu đang ở login.html hoặc register.html thì chuyển về index.html, nếu ở trang khác thì cập nhật Header tức thì
  const isAuthPage = window.location.pathname.includes('login') || window.location.pathname.includes('register') || document.getElementById('tz-login-form') || document.getElementById('tz-register-form');
  if (isAuthPage) {
    window.location.href = 'index.html';
  } else {
    initUserAccount();
    showToast(welcomeMsg, 'success', `Đăng nhập ${provider} thành công!`);
  }
}

// Tương thích ngược với các lệnh gọi cũ
function loginWithGoogle(fullname, email) {
  loginWithSocialPlatform('Google', fullname, email);
}

// --- 1. GOOGLE MODAL POPUP ---
function openGoogleModal() {
  // KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP: Nếu đã đăng nhập (localStorage tồn tại currentUser) -> HỦY BỎ HOÀN TOÀN
  const currentUser = typeof Auth !== 'undefined' ? Auth.getUser() : null;
  const userInStorage = localStorage.getItem('currentUser') || localStorage.getItem('techzone_current_user');
  if (currentUser || userInStorage) {
    closeGoogleModal();
    return;
  }

  let modal = document.getElementById('tz-google-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'tz-modal-overlay';
    modal.id = 'tz-google-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'tz-google-modal-title');
    modal.innerHTML = `
      <div class="tz-google-modal-card">
        <div class="google-modal-header">
          <img src="images/google-icon.svg" alt="Google" width="32" height="32" class="google-logo">
          <h3 id="tz-google-modal-title">Đăng nhập bằng Google</h3>
          <p class="google-sub">Chọn tài khoản Google để tiếp tục đến <strong>TechZone</strong></p>
        </div>

        <div class="google-account-list">
          <!-- Account 1 -->
          <div class="google-account-item" data-fullname="Nguyễn Văn An" data-email="an.nguyen@gmail.com">
            <div class="google-avatar avatar-blue">A</div>
            <div class="google-user-meta">
              <div class="google-user-name">Nguyễn Văn An</div>
              <div class="google-user-email">an.nguyen@gmail.com</div>
            </div>
            <i class="fa-solid fa-angle-right google-arrow"></i>
          </div>

          <!-- Account 2 -->
          <div class="google-account-item" data-fullname="Trần Thị Mai" data-email="mai.tran@gmail.com">
            <div class="google-avatar avatar-purple">M</div>
            <div class="google-user-meta">
              <div class="google-user-name">Trần Thị Mai</div>
              <div class="google-user-email">mai.tran@gmail.com</div>
            </div>
            <i class="fa-solid fa-angle-right google-arrow"></i>
          </div>

          <!-- Account 3: Custom Google Toggle -->
          <div class="google-account-item google-custom-toggle" id="btn-toggle-custom-google">
            <div class="google-avatar avatar-gray">
              <i class="fa-solid fa-user-plus"></i>
            </div>
            <div class="google-user-meta">
              <div class="google-user-name">Sử dụng tài khoản khác</div>
              <div class="google-user-email">Nhập họ tên và Gmail của bạn</div>
            </div>
            <i class="fa-solid fa-angle-down google-arrow" id="google-arrow-toggle"></i>
          </div>
        </div>

        <!-- Custom Google Input Form -->
        <form class="google-custom-form" id="form-custom-google" style="display: none;">
          <div class="google-input-group">
            <label for="google-custom-name">Họ và tên Google của bạn</label>
            <input type="text" id="google-custom-name" placeholder="Ví dụ: Lê Hoàng Nam" required>
          </div>
          <div class="google-input-group">
            <label for="google-custom-email">Địa chỉ Email Google (Gmail)</label>
            <input type="email" id="google-custom-email" placeholder="Ví dụ: nam.le@gmail.com" required>
          </div>
          <button type="submit" class="btn-submit-google-custom">
            <i class="fa-solid fa-arrow-right-to-bracket"></i> Đăng nhập với tài khoản này
          </button>
        </form>

        <div class="google-modal-footer">
          <button type="button" class="btn-cancel-google" id="btn-close-google-modal">Hủy bỏ</button>
          <span class="google-secure-badge"><i class="fa-solid fa-shield-halved"></i> Google Identity Services</span>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.onclick = (e) => {
      if (e.target === modal) closeAllSocialModals();
    };

    const closeBtn = modal.querySelector('#btn-close-google-modal');
    if (closeBtn) closeBtn.onclick = (e) => { e.preventDefault(); closeAllSocialModals(); };

    const items = modal.querySelectorAll('.google-account-item[data-fullname]');
    items.forEach(item => {
      item.onclick = (e) => {
        e.preventDefault();
        const fn = item.getAttribute('data-fullname');
        const em = item.getAttribute('data-email');
        loginWithSocialPlatform('Google', fn, em);
      };
    });

    const toggleBtn = modal.querySelector('#btn-toggle-custom-google');
    const customForm = modal.querySelector('#form-custom-google');
    const arrowIcon = modal.querySelector('#google-arrow-toggle');
    if (toggleBtn && customForm) {
      toggleBtn.onclick = (e) => {
        e.preventDefault();
        const isHidden = customForm.style.display === 'none';
        customForm.style.display = isHidden ? 'block' : 'none';
        if (arrowIcon) {
          arrowIcon.className = isHidden ? 'fa-solid fa-angle-up google-arrow' : 'fa-solid fa-angle-down google-arrow';
        }
        if (isHidden) {
          const inputName = customForm.querySelector('#google-custom-name');
          if (inputName) inputName.focus();
        }
      };

      customForm.onsubmit = (e) => {
        e.preventDefault();
        const nameInput = customForm.querySelector('#google-custom-name');
        const emailInput = customForm.querySelector('#google-custom-email');
        const fn = nameInput ? nameInput.value.trim() : '';
        const em = emailInput ? emailInput.value.trim() : '';
        if (!fn || !em) return;
        loginWithSocialPlatform('Google', fn, em);
      };
    }
  }

  closeAllSocialModals();
  modal.style.display = 'flex';
  modal.classList.add('show');
}

function closeGoogleModal() {
  closeAllSocialModals();
  const googleModals = document.querySelectorAll('#tz-google-modal, #googleLoginModal, .google-modal-backdrop, .google-one-tap');
  googleModals.forEach(m => {
    m.classList.remove('show', 'active');
    m.style.display = 'none';
  });
}

// --- 2. FACEBOOK MODAL POPUP ---
function openFacebookModal() {
  let modal = document.getElementById('tz-facebook-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'tz-modal-overlay';
    modal.id = 'tz-facebook-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="tz-facebook-modal-card">
        <div class="facebook-modal-banner">
          <div class="facebook-brand-title">
            <i class="fa-brands fa-facebook"></i> facebook
          </div>
          <button type="button" class="facebook-btn-close" id="btn-close-fb-x" title="Đóng">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="facebook-modal-body">
          <div class="facebook-app-info">
            <div class="facebook-app-icon">
              <i class="fa-solid fa-microchip"></i>
            </div>
            <div class="facebook-app-text">
              <h4>Đăng nhập với Facebook</h4>
              <p>Ứng dụng <strong>TechZone Store</strong> sẽ nhận được tên và ảnh hồ sơ cá nhân của bạn.</p>
            </div>
          </div>

          <div class="facebook-user-preview">
            <div class="facebook-avatar-box">
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="facebook-preview-meta">
              <div class="facebook-preview-name" id="fb-preview-display-name">Trần Hoàng Nam</div>
              <div class="facebook-preview-sub">Tài khoản Facebook của bạn</div>
            </div>
          </div>

          <form id="form-facebook-auth">
            <div class="facebook-input-group">
              <label for="fb-custom-name">Họ và tên của bạn trên Facebook</label>
              <input type="text" id="fb-custom-name" value="Trần Hoàng Nam" placeholder="Ví dụ: Trần Hoàng Nam" required>
            </div>

            <div class="facebook-input-group">
              <label for="fb-custom-email">Email hoặc Số điện thoại Facebook</label>
              <input type="text" id="fb-custom-email" value="nam.tran@facebook.com" placeholder="Ví dụ: nam.tran@facebook.com" required>
            </div>

            <button type="submit" class="btn-facebook-continue" id="btn-facebook-submit">
              <i class="fa-brands fa-facebook-f"></i> Tiếp tục dưới tên <span id="fb-btn-name-preview">Trần Hoàng Nam</span>
            </button>

            <button type="button" class="btn-facebook-cancel" id="btn-close-fb-modal">
              Hủy bỏ
            </button>
          </form>
        </div>

        <div class="facebook-modal-footer">
          Thao tác này không cho phép TechZone đăng bài lên Facebook mà không có sự đồng ý của bạn. • <a href="#" style="color:#1877F2; text-decoration:none;">Chính sách bảo mật Meta</a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.onclick = (e) => {
      if (e.target === modal) closeAllSocialModals();
    };

    const closeX = modal.querySelector('#btn-close-fb-x');
    if (closeX) closeX.onclick = (e) => { e.preventDefault(); closeAllSocialModals(); };

    const cancelBtn = modal.querySelector('#btn-close-fb-modal');
    if (cancelBtn) cancelBtn.onclick = (e) => { e.preventDefault(); closeAllSocialModals(); };

    const nameInput = modal.querySelector('#fb-custom-name');
    const previewName = modal.querySelector('#fb-preview-display-name');
    const btnPreview = modal.querySelector('#fb-btn-name-preview');

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        const val = nameInput.value.trim() || 'bạn';
        if (previewName) previewName.textContent = nameInput.value.trim() || 'Người dùng Facebook';
        if (btnPreview) btnPreview.textContent = val;
      });
    }

    const form = modal.querySelector('#form-facebook-auth');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const fn = modal.querySelector('#fb-custom-name')?.value.trim() || 'Trần Hoàng Nam';
        const em = modal.querySelector('#fb-custom-email')?.value.trim() || 'nam.tran@facebook.com';
        loginWithSocialPlatform('Facebook', fn, em);
      };
    }
  }

  closeAllSocialModals();
  modal.classList.add('show');
}

// --- 3. ZALO MODAL POPUP ---
function openZaloModal() {
  let modal = document.getElementById('tz-zalo-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'tz-modal-overlay';
    modal.id = 'tz-zalo-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="tz-zalo-modal-card">
        <div class="zalo-modal-header">
          <img src="images/zalo-icon.svg" alt="Zalo" class="zalo-modal-logo">
          <h3>Đăng Nhập Zalo</h3>
          <p>Kết nối tài khoản Zalo với hệ thống bán lẻ <strong>TechZone</strong></p>
        </div>

        <div class="zalo-tab-switch">
          <button type="button" class="zalo-tab-btn active" data-target="qr">
            <i class="fa-solid fa-qrcode"></i> Quét mã QR
          </button>
          <button type="button" class="zalo-tab-btn" data-target="phone">
            <i class="fa-solid fa-phone"></i> SĐT & Tên
          </button>
        </div>

        <!-- Tab 1: QR Code -->
        <div class="zalo-tab-content" id="zalo-tab-qr">
          <div class="zalo-qr-box">
            <div class="zalo-qr-graphic">
              <div class="zalo-qr-laser"></div>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="26" height="26" rx="4" fill="#0068FF" />
                <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="13" y="13" width="10" height="10" fill="#0068FF" />
                <rect x="69" y="5" width="26" height="26" rx="4" fill="#0068FF" />
                <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="77" y="13" width="10" height="10" fill="#0068FF" />
                <rect x="5" y="69" width="26" height="26" rx="4" fill="#0068FF" />
                <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="13" y="77" width="10" height="10" fill="#0068FF" />
                <rect x="37" y="7" width="6" height="6" fill="#1e293b" />
                <rect x="47" y="7" width="6" height="6" fill="#1e293b" />
                <rect x="57" y="7" width="6" height="6" fill="#1e293b" />
                <rect x="37" y="17" width="6" height="6" fill="#1e293b" />
                <rect x="57" y="17" width="6" height="6" fill="#1e293b" />
                <rect x="37" y="27" width="6" height="6" fill="#1e293b" />
                <rect x="47" y="27" width="6" height="6" fill="#1e293b" />
                <rect x="7" y="37" width="6" height="6" fill="#1e293b" />
                <rect x="17" y="37" width="6" height="6" fill="#1e293b" />
                <rect x="27" y="37" width="6" height="6" fill="#1e293b" />
                <rect x="67" y="37" width="6" height="6" fill="#1e293b" />
                <rect x="77" y="37" width="6" height="6" fill="#1e293b" />
                <rect x="87" y="37" width="6" height="6" fill="#1e293b" />
                <rect x="7" y="47" width="6" height="6" fill="#1e293b" />
                <rect x="27" y="47" width="6" height="6" fill="#1e293b" />
                <rect x="67" y="47" width="6" height="6" fill="#1e293b" />
                <rect x="87" y="47" width="6" height="6" fill="#1e293b" />
                <rect x="7" y="57" width="6" height="6" fill="#1e293b" />
                <rect x="17" y="57" width="6" height="6" fill="#1e293b" />
                <rect x="27" y="57" width="6" height="6" fill="#1e293b" />
                <rect x="67" y="57" width="6" height="6" fill="#1e293b" />
                <rect x="77" y="57" width="6" height="6" fill="#1e293b" />
                <rect x="87" y="57" width="6" height="6" fill="#1e293b" />
                <rect x="37" y="67" width="6" height="6" fill="#1e293b" />
                <rect x="47" y="67" width="6" height="6" fill="#1e293b" />
                <rect x="57" y="67" width="6" height="6" fill="#1e293b" />
                <rect x="67" y="67" width="6" height="6" fill="#1e293b" />
                <rect x="77" y="67" width="6" height="6" fill="#1e293b" />
                <rect x="37" y="77" width="6" height="6" fill="#1e293b" />
                <rect x="57" y="77" width="6" height="6" fill="#1e293b" />
                <rect x="77" y="77" width="6" height="6" fill="#1e293b" />
                <rect x="37" y="87" width="6" height="6" fill="#1e293b" />
                <rect x="47" y="87" width="6" height="6" fill="#1e293b" />
                <rect x="67" y="87" width="6" height="6" fill="#1e293b" />
                <rect x="87" y="87" width="6" height="6" fill="#1e293b" />
                <rect x="36" y="36" width="28" height="28" rx="6" fill="#0068FF" />
                <text x="50" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">Z</text>
              </svg>
            </div>
            <p style="font-size:0.84rem; color:#64748b; margin:0 0 0.85rem;">Mở app Zalo trên điện thoại quét mã QR để đăng nhập ngay</p>
            <button type="button" class="btn-zalo-quick-scan" id="btn-zalo-scan-success">
              <i class="fa-solid fa-bolt"></i> ⚡ Xác nhận quét thành công (Nguyễn Thị Thu)
            </button>
          </div>
        </div>

        <!-- Tab 2: Phone & Name -->
        <div class="zalo-tab-content" id="zalo-tab-phone" style="display: none;">
          <form class="zalo-phone-form" id="form-zalo-phone">
            <div class="facebook-input-group">
              <label for="zalo-custom-name">Họ và tên Zalo của bạn</label>
              <input type="text" id="zalo-custom-name" value="Nguyễn Thị Thu" placeholder="Ví dụ: Nguyễn Thị Thu" required>
            </div>
            <div class="facebook-input-group">
              <label for="zalo-custom-phone">Số điện thoại đăng ký Zalo</label>
              <input type="tel" id="zalo-custom-phone" value="0912888999" placeholder="Ví dụ: 0912888999" required>
            </div>
            <button type="submit" class="btn-zalo-submit">
              <i class="fa-solid fa-arrow-right-to-bracket"></i> Đăng nhập bằng Zalo
            </button>
          </form>
        </div>

        <div>
          <button type="button" class="btn-zalo-cancel" id="btn-close-zalo-modal">Hủy bỏ</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.onclick = (e) => {
      if (e.target === modal) closeAllSocialModals();
    };

    const cancelBtn = modal.querySelector('#btn-close-zalo-modal');
    if (cancelBtn) cancelBtn.onclick = (e) => { e.preventDefault(); closeAllSocialModals(); };

    // Tab switcher
    const tabBtns = modal.querySelectorAll('.zalo-tab-btn');
    const tabQr = modal.querySelector('#zalo-tab-qr');
    const tabPhone = modal.querySelector('#zalo-tab-phone');

    tabBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.getAttribute('data-target');
        if (target === 'qr') {
          if (tabQr) tabQr.style.display = 'block';
          if (tabPhone) tabPhone.style.display = 'none';
        } else {
          if (tabQr) tabQr.style.display = 'none';
          if (tabPhone) tabPhone.style.display = 'block';
        }
      };
    });

    // Quick scan simulate button
    const quickScanBtn = modal.querySelector('#btn-zalo-scan-success');
    if (quickScanBtn) {
      quickScanBtn.onclick = (e) => {
        e.preventDefault();
        loginWithSocialPlatform('Zalo', 'Nguyễn Thị Thu', 'thu.nguyen@zalo.me', { phone: '0912888999' });
      };
    }

    // Phone form submit
    const phoneForm = modal.querySelector('#form-zalo-phone');
    if (phoneForm) {
      phoneForm.onsubmit = (e) => {
        e.preventDefault();
        const fn = modal.querySelector('#zalo-custom-name')?.value.trim() || 'Nguyễn Thị Thu';
        const ph = modal.querySelector('#zalo-custom-phone')?.value.trim() || '0912888999';
        loginWithSocialPlatform('Zalo', fn, `${ph}@zalo.me`, { phone: ph });
      };
    }
  }

  closeAllSocialModals();
  modal.classList.add('show');
}

// --- 4. APPLE MODAL POPUP ---
function openAppleModal() {
  let modal = document.getElementById('tz-apple-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'tz-modal-overlay';
    modal.id = 'tz-apple-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="tz-apple-modal-card">
        <div class="apple-modal-header">
          <i class="fa-brands fa-apple apple-logo-icon"></i>
          <h3>Đăng Nhập Bằng Apple ID</h3>
          <p>Sử dụng Apple ID và Face ID / Touch ID của bạn để đăng nhập vào <strong>TechZone</strong></p>
        </div>

        <div class="apple-biometric-badge" id="apple-biometric-icon">
          <i class="fa-solid fa-face-smile"></i>
        </div>

        <form class="apple-form-content" id="form-apple-auth">
          <div class="apple-input-group">
            <label for="apple-custom-name">Họ và tên Apple ID của bạn</label>
            <input type="text" id="apple-custom-name" value="Đặng Văn Hùng" placeholder="Ví dụ: Đặng Văn Hùng" required>
          </div>

          <div class="apple-input-group">
            <label for="apple-custom-email">Apple ID (Địa chỉ iCloud)</label>
            <input type="email" id="apple-custom-email" value="hung.dang@icloud.com" placeholder="Ví dụ: hung.dang@icloud.com" required>
          </div>

          <label class="apple-relay-option" for="apple-hide-email">
            <input type="checkbox" id="apple-hide-email" checked>
            <span>Ẩn email của tôi (Chuyển tiếp thư từ @privaterelay.appleid.com)</span>
          </label>

          <div style="margin-top: 1.25rem;">
            <button type="submit" class="btn-apple-submit" id="btn-apple-confirm">
              <i class="fa-brands fa-apple"></i> Tiếp tục với Apple ID (Face ID)
            </button>
            <button type="button" class="btn-apple-cancel" id="btn-close-apple-modal">
              Hủy bỏ
            </button>
          </div>
        </form>

        <div class="apple-modal-footer">
          Quyền riêng tư của Apple: TechZone chỉ nhận được tên và địa chỉ email đã được chuyển tiếp bảo mật.
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.onclick = (e) => {
      if (e.target === modal) closeAllSocialModals();
    };

    const cancelBtn = modal.querySelector('#btn-close-apple-modal');
    if (cancelBtn) cancelBtn.onclick = (e) => { e.preventDefault(); closeAllSocialModals(); };

    const form = modal.querySelector('#form-apple-auth');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const bioBadge = modal.querySelector('#apple-biometric-icon');
        const submitBtn = modal.querySelector('#btn-apple-confirm');
        
        if (bioBadge) {
          bioBadge.classList.add('verified');
          bioBadge.innerHTML = '<i class="fa-solid fa-check"></i>';
        }
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xác thực Face ID...';
        }

        setTimeout(() => {
          const fn = modal.querySelector('#apple-custom-name')?.value.trim() || 'Đặng Văn Hùng';
          const em = modal.querySelector('#apple-custom-email')?.value.trim() || 'hung.dang@icloud.com';
          loginWithSocialPlatform('Apple', fn, em);
        }, 500);
      };
    }
  }

  closeAllSocialModals();
  const bioBadge = modal.querySelector('#apple-biometric-icon');
  if (bioBadge) {
    bioBadge.classList.remove('verified');
    bioBadge.innerHTML = '<i class="fa-solid fa-face-smile"></i>';
  }
  const submitBtn = modal.querySelector('#btn-apple-confirm');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fa-brands fa-apple"></i> Tiếp tục với Apple ID (Face ID)';
  }
  modal.classList.add('show');
}

// Cập nhật hiển thị tài khoản trên Header
function initUserAccount() {
  const userBtn = document.getElementById('tz-user-btn') || document.getElementById('tz-header-user-btn') || document.querySelector('.tz-user-btn');
  const userDropdown = document.getElementById('tz-user-dropdown') || document.querySelector('.tz-user-dropdown');
  const nameDisplay = document.getElementById('tz-user-name-display');
  const greetingDisplay = document.getElementById('tz-dropdown-greeting');
  const logoutBtn = document.getElementById('tz-btn-logout');
  const profileBtn = document.getElementById('tz-btn-profile-info');

  // Lấy currentUser từ localStorage
  const currentUser = typeof Auth !== 'undefined' ? Auth.getUser() : null;

  if (currentUser && currentUser.fullname) {
    if (nameDisplay) {
      nameDisplay.textContent = currentUser.fullname;
      nameDisplay.style.color = '#38bdf8';
      nameDisplay.style.fontWeight = '700';
    }
    if (greetingDisplay) {
      greetingDisplay.textContent = `Xin chào, ${currentUser.fullname}!`;
    }

    if (userBtn) {
      userBtn.setAttribute('href', 'javascript:void(0);');
      userBtn.setAttribute('title', `Tài khoản: ${currentUser.fullname}`);
      userBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (userDropdown) {
          userDropdown.classList.toggle('show');
        }
      };
    }

    // Click outside closes dropdown
    document.addEventListener('click', (e) => {
      if (userDropdown && !e.target.closest('#tz-user-wrapper') && !e.target.closest('.tz-user-wrapper') && !e.target.closest('.user-account-wrapper') && !e.target.closest('.tz-auth-nav-wrap')) {
        userDropdown.classList.remove('show');
      }
    });

    // Khi di chuột hoặc click vào nút giỏ hàng, đóng ngay menu tài khoản nếu đang mở
    const cartBtn = document.querySelector('.tz-cart-btn, .header-cart-btn');
    if (cartBtn && userDropdown) {
      cartBtn.addEventListener('mouseenter', () => {
        userDropdown.classList.remove('show');
      });
    }

    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (userDropdown) {
          userDropdown.classList.remove('show');
        }
        const pathname = window.location.pathname.toLowerCase();
        if (pathname.includes('voucher')) {
          handleVoucherLogout(e);
          return;
        }
        if (typeof openLogoutModal === 'function') {
          openLogoutModal();
        } else if (typeof Auth !== 'undefined' && Auth.logout) {
          Auth.logout();
          window.location.href = 'index.html';
        }
      };
    }

    if (profileBtn) {
      profileBtn.setAttribute('href', 'profile.html');
      profileBtn.onclick = null;
    }
  } else {
    // Trạng thái Chưa đăng nhập
    if (nameDisplay) {
      nameDisplay.textContent = 'Đăng nhập';
      nameDisplay.style.color = '';
      nameDisplay.style.fontWeight = '';
    }
    if (userBtn) {
      userBtn.setAttribute('href', 'login.html');
      userBtn.setAttribute('title', 'Đăng nhập tài khoản');
      userBtn.onclick = null;
    }
    if (userDropdown) {
      userDropdown.classList.remove('show');
    }
  }
}

// Bật/tắt menu dropdown tài khoản toàn cục khi click
window.toggleUserDropdown = function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const currentUser = typeof Auth !== 'undefined' ? Auth.getUser() : null;
  if (!currentUser || !currentUser.fullname) {
    window.location.href = 'login.html';
    return;
  }
  const userDropdown = document.getElementById('tz-user-dropdown') || document.querySelector('.tz-user-dropdown');
  if (userDropdown) {
    userDropdown.classList.toggle('show');
  }
};

// --- 14. LOGIN & REGISTER PAGES CONTROLLER ---
function initLoginPage() {
  const form = document.getElementById('tz-login-form');
  if (!form) return;

  // Khởi tạo nút ẩn/hiện mật khẩu
  initPasswordToggles();

  // Khởi tạo danh sách tài khoản mặc định (admin) nếu chưa có
  Auth.getRegisteredUsers();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const accountInput = document.getElementById('login-account');
    const passInput = document.getElementById('login-password');

    const account = accountInput ? accountInput.value.trim() : '';
    const password = passInput ? passInput.value.trim() : '';

    if (!account || !password) {
      showToast('Vui lòng điền đầy đủ Email/Tên đăng nhập và Mật khẩu!', 'warning', 'Chưa đủ thông tin');
      return;
    }

    // Kiểm tra đối chiếu với danh sách 'registeredUsers' trong localStorage
    const result = Auth.login(account, password);

    // NẾU TÀI KHOẢN CHƯA ĐƯỢC ĐĂNG KÝ HOẶC SAI MẬT KHẨU: Tuyệt đối KHÔNG CHO PHÉP đăng nhập!
    if (!result.success) {
      showToast('Tài khoản hoặc mật khẩu không chính xác! Vui lòng đăng ký tài khoản trước.', 'error', 'Đăng nhập thất bại');
      if (passInput) passInput.value = '';
      return;
    }

    // NẾU THÔNG TIN KHỚP:
    const user = result.user;
    sessionStorage.setItem('techzone_toast_flash', JSON.stringify({
      title: 'Đăng nhập thành công!',
      message: `Chào mừng <strong>${user.fullname}</strong> đã quay trở lại TechZone.`,
      type: 'success'
    }));

    window.location.href = 'index.html';
  });

  // Social Login Buttons Handler
  initSocialAuthHandlers('Đăng nhập');
}

// Toggle hiển thị / ẩn mật khẩu (icon con mắt)
function initPasswordToggles() {
  const toggles = document.querySelectorAll('.tz-password-toggle');
  toggles.forEach(toggle => {
    toggle.onclick = (e) => {
      e.preventDefault();
      const targetId = toggle.getAttribute('data-target');
      if (!targetId) return;
      const input = document.getElementById(targetId);
      if (!input) return;
      const icon = toggle.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        }
      } else {
        input.type = 'password';
        if (icon) {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    };
  });
}

// --- 14. LUỒNG ĐĂNG KÝ BƯỚC 1 (register.html) ---
function initRegisterPage() {
  const form = document.getElementById('tz-register-form');
  if (!form) return;

  // Khởi tạo các nút ẩn/hiện mật khẩu
  initPasswordToggles();

  // Khởi tạo danh sách tài khoản mặc định nếu chưa có
  Auth.getRegisteredUsers();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('reg-account') || document.getElementById('reg-email');
    const passInput = document.getElementById('reg-password');
    const confirmInput = document.getElementById('reg-confirm-password');
    const termsInput = document.getElementById('reg-terms');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passInput ? passInput.value.trim() : '';
    const confirmPass = confirmInput ? confirmInput.value.trim() : '';

    if (!email || !password || !confirmPass) {
      showToast('Vui lòng điền đầy đủ Email và Mật khẩu!', 'warning', 'Chưa đủ thông tin');
      return;
    }

    // Kiểm tra định dạng Email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Định dạng Email không hợp lệ (Ví dụ: user@example.com)!', 'warning', 'Email không đúng');
      if (emailInput) emailInput.focus();
      return;
    }

    // Kiểm tra xem Email đã tồn tại trong danh sách registeredUsers chưa
    const cleanEmail = email.toLowerCase();
    const users = Auth.getRegisteredUsers();
    const exists = users.some(u => (u.email && u.email.toLowerCase() === cleanEmail) || (u.username && u.username.toLowerCase() === cleanEmail));
    if (exists) {
      showToast('Email này đã được đăng ký! Vui lòng đăng nhập hoặc dùng email khác.', 'error', 'Email đã tồn tại');
      if (emailInput) emailInput.focus();
      return;
    }

    // Kiểm tra độ dài mật khẩu tối thiểu 6 ký tự
    if (password.length < 6) {
      showToast('Mật khẩu bảo mật phải có độ dài tối thiểu 6 ký tự!', 'warning', 'Mật khẩu quá ngắn');
      if (passInput) passInput.focus();
      return;
    }

    // Kiểm tra xác nhận mật khẩu khớp nhau
    if (password !== confirmPass) {
      showToast('Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.', 'error', 'Mật khẩu không khớp');
      if (confirmInput) confirmInput.focus();
      return;
    }

    // Kiểm tra checkbox điều khoản dịch vụ
    if (termsInput && !termsInput.checked) {
      showToast('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật!', 'warning', 'Chưa đồng ý điều khoản');
      return;
    }

    // LƯU TẠM THÔNG TIN BƯỚC 1 VÀ TỰ ĐỘNG CHUYỂN HƯỚNG SANG BƯỚC 2 (complete-profile.html)
    sessionStorage.setItem('techzone_pending_register', JSON.stringify({
      email: cleanEmail,
      password: password
    }));

    window.location.href = 'complete-profile.html';
  });

  // Social Register Buttons Handler
  initSocialAuthHandlers('Đăng ký');
}

// --- LUỒNG ĐĂNG KÝ BƯỚC 2: HOÀN THIỆN THÔNG TIN CÁ NHÂN (complete-profile.html) ---
function initCompleteProfilePage() {
  const form = document.getElementById('tz-complete-profile-form');
  if (!form) return;

  // Kiểm tra dữ liệu từ Bước 1
  const pendingRaw = sessionStorage.getItem('techzone_pending_register');
  if (!pendingRaw) {
    // Nếu người dùng truy cập trực tiếp mà chưa qua bước 1
    const currentUser = Auth.getUser();
    if (!currentUser) {
      sessionStorage.setItem('techzone_toast_flash', JSON.stringify({
        title: 'Yêu cầu đăng ký Bước 1',
        message: 'Vui lòng nhập Email và Mật khẩu ở Bước 1 trước!',
        type: 'warning'
      }));
      window.location.href = 'register.html';
      return;
    }
  }

  const pending = pendingRaw ? JSON.parse(pendingRaw) : {};
  const emailDisplay = document.getElementById('display-pending-email');
  if (emailDisplay && pending.email) {
    emailDisplay.textContent = `Tài khoản: ${pending.email}`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('complete-fullname');
    const phoneInput = document.getElementById('complete-phone');
    const birthdayInput = document.getElementById('complete-birthday');
    const cityInput = document.getElementById('complete-city');
    const addressInput = document.getElementById('complete-address');

    const fullname = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const birthday = birthdayInput ? birthdayInput.value : '';
    const city = cityInput ? cityInput.value.trim() : '';
    const address = addressInput ? addressInput.value.trim() : '';

    let gender = 'nam';
    const checkedGender = document.querySelector('input[name="complete-gender"]:checked');
    if (checkedGender) gender = checkedGender.value;

    if (!fullname) {
      showToast('Vui lòng nhập Họ và tên thật của bạn!', 'warning', 'Thiếu họ tên');
      if (nameInput) nameInput.focus();
      return;
    }

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      showToast('Số điện thoại liên hệ phải gồm đúng 10 chữ số!', 'warning', 'Số điện thoại không đúng');
      if (phoneInput) phoneInput.focus();
      return;
    }

    if (!city) {
      showToast('Vui lòng chọn Tỉnh / Thành phố nhận hàng!', 'warning', 'Chưa chọn khu vực');
      if (cityInput) cityInput.focus();
      return;
    }

    const email = pending.email || `${phone}@gmail.com`;
    const password = pending.password || '123456';
    const username = email.split('@')[0];

    // Tạo tài khoản mới HOÀN THIỆN: Điểm = 0, Chi tiêu = 0, Đơn hàng = 0, Hạng = Smember Tiêu chuẩn
    const newUser = {
      username: username,
      email: email,
      fullname: fullname,
      name: fullname,
      phone: phone,
      gender: gender,
      birthday: birthday,
      city: city,
      district: '',
      addressDetail: address,
      password: String(password),
      provider: 'local',
      points: 0,
      totalSpent: 0,
      ordersCount: 0,
      rank: 'Smember Tiêu chuẩn',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullname)}&backgroundColor=0284c7`,
      registeredAt: new Date().toISOString()
    };

    // Lưu vào 'registeredUsers' trong localStorage
    const users = Auth.getRegisteredUsers();
    const existingIdx = users.findIndex(u => (u.email && u.email.toLowerCase() === email.toLowerCase()) || (u.username === username));
    if (existingIdx !== -1) {
      users[existingIdx] = newUser;
    } else {
      users.push(newUser);
    }
    localStorage.setItem(Auth.STORAGE_USERS_KEY, JSON.stringify(users));

    // Đăng nhập ngay lập tức cho người dùng
    Auth.setCurrentUser(newUser);

    // Xóa session tạm
    sessionStorage.removeItem('techzone_pending_register');

    // Lưu flash toast chào mừng
    sessionStorage.setItem('techzone_toast_flash', JSON.stringify({
      title: 'Đăng ký thành công!',
      message: `Chào mừng thành viên mới <strong>${fullname}</strong>! Tài khoản của bạn đã sẵn sàng nhận ưu đãi.`,
      type: 'success'
    }));

    // Chuyển thẳng về trang chủ index.html
    window.location.href = 'index.html';
  });
}

// --- HELPER: TÍNH TOÁN VÀ ĐỒNG BỘ THỐNG KÊ CHI TIÊU & ĐIỂM SMEMBER CHUẨN XÁC ---
function calculateAndSyncUserStats(user) {
  const currentUser = user || Auth.getUser();
  if (!currentUser) {
    return { totalSpent: 0, rewardPoints: 0, completedOrdersCount: 0, rankText: 'Smember Mới', rankIconHtml: '<i class="fa-solid fa-seedling"></i>' };
  }

  const allOrders = Storage.getOrders();
  const cEmail = (currentUser.email || '').toLowerCase().trim();
  const cPhone = (currentUser.phone || '').replace(/\D/g, '');
  const cName = (currentUser.fullname || '').toLowerCase().trim();

  // 1. Lọc tất cả đơn hàng thuộc về tài khoản này
  const userOrders = allOrders.filter(o => {
    const oEmail = (o.userEmail || o.customer?.email || '').toLowerCase().trim();
    const oPhone = (o.customer?.phone || '').replace(/\D/g, '');
    const oName = (o.customer?.name || '').toLowerCase().trim();

    if (cEmail && oEmail && cEmail === oEmail) return true;
    if (cPhone && oPhone && cPhone === oPhone) return true;
    if (cName && oName && cName === oName) return true;
    // Tài khoản admin mẫu được xem các đơn mock của TechZone
    if (currentUser.username === 'admin' && (o.customer?.name === 'Quản trị viên TechZone' || o.id === 'SPX-892341' || o.id === 'SPX-661205')) return true;
    return false;
  });

  // 2. LỌC CHỈ CÁC ĐƠN HÀNG HOÀN THÀNH / ĐÃ GIAO (status === 'Đã giao' || status === 'Giao hàng thành công')
  // RÀNG BUỘC TUYỆT ĐỐI: Những đơn hàng có trạng thái "Đã hủy" (cancelled) hoặc "Chờ xác nhận" KHÔNG ĐƯỢC CỘNG
  const completedOrders = userOrders.filter(o => {
    if (!o || !o.status) return false;
    const st = o.status.trim().toLowerCase();
    if (st.includes('hủy') || st.includes('cancel') || st.includes('chờ') || st.includes('xác nhận') || st.includes('đang giao')) {
      return false;
    }
    return st === 'đã giao' || st === 'giao hàng thành công' || st === 'hoàn thành' || st === 'completed';
  });

  // 3. Tính Tổng chi tiêu tích lũy và Điểm Smember (1% của tổng chi tiêu, làm tròn nguyên)
  const totalSpent = completedOrders.reduce((sum, o) => {
    const amount = Number(o.total !== undefined && o.total !== null ? o.total : o.subtotal) || 0;
    return sum + amount;
  }, 0);

  const rewardPoints = Math.round(totalSpent * 0.01);
  const completedOrdersCount = completedOrders.length;

  // 4. Phân hạng Smember dựa trên tổng chi tiêu tích lũy:
  // Dưới 5 triệu là "Smember Mới", từ 5 - 20 triệu là "Smember Bạc", trên 20 triệu là "Smember VIP Vàng"
  let rankText = 'Smember Mới';
  let rankIconHtml = '<i class="fa-solid fa-seedling"></i>';
  if (totalSpent >= 20000000) {
    rankText = 'Smember VIP Vàng';
    rankIconHtml = '<i class="fa-solid fa-crown"></i>';
  } else if (totalSpent >= 5000000) {
    rankText = 'Smember Bạc';
    rankIconHtml = '<i class="fa-solid fa-medal"></i>';
  }

  // 5. Cập nhật vào đối tượng user trong localStorage
  currentUser.points = rewardPoints;
  currentUser.totalSpent = totalSpent;
  currentUser.completedOrdersCount = completedOrdersCount;
  currentUser.rank = rankText;
  Auth.setCurrentUser(currentUser);

  // Đồng bộ vào mảng registeredUsers
  const users = Auth.getRegisteredUsers();
  const userIdx = users.findIndex(u => (u.email && u.email.toLowerCase() === cEmail) || (u.username === currentUser.username));
  if (userIdx !== -1) {
    users[userIdx].points = rewardPoints;
    users[userIdx].totalSpent = totalSpent;
    users[userIdx].completedOrdersCount = completedOrdersCount;
    users[userIdx].rank = rankText;
    localStorage.setItem(Auth.STORAGE_USERS_KEY, JSON.stringify(users));
  }

  // 6. Nếu đang ở trang profile.html, cập nhật trực tiếp lên DOM
  const pointsEl = document.getElementById('profile-reward-points');
  const spentEl = document.getElementById('profile-total-spent');
  const ordersCountEl = document.getElementById('profile-orders-count');
  const userRankBadge = document.getElementById('profile-rank-badge');

  if (pointsEl) pointsEl.innerHTML = `${rewardPoints.toLocaleString('vi-VN')} <span class="unit">điểm</span>`;
  if (spentEl) spentEl.innerHTML = `${totalSpent.toLocaleString('vi-VN')} <span class="unit">đ</span>`;
  if (ordersCountEl) ordersCountEl.innerHTML = `${completedOrdersCount} <span class="unit">đơn hàng</span>`;
  if (userRankBadge) userRankBadge.innerHTML = `${rankIconHtml} ${rankText}`;

  return { totalSpent, rewardPoints, completedOrdersCount, rankText, rankIconHtml };
}

// --- TRANG HỒ SƠ TÀI KHOẢN (profile.html) ---
function initProfilePage() {
  // 1. Kiểm tra trạng thái đăng nhập (Auth Guard)
  const currentUser = Auth.getUser();
  if (!currentUser) {
    sessionStorage.setItem('techzone_toast_flash', JSON.stringify({
      title: 'Yêu cầu đăng nhập',
      message: 'Vui lòng đăng nhập để truy cập Hồ sơ tài khoản!',
      type: 'warning'
    }));
    window.location.href = 'login.html';
    return;
  }

  // 2. Điền thông tin vào Sidebar & Form Profile
  const sidebarAvatar = document.getElementById('profile-avatar-img');
  const sidebarName = document.getElementById('profile-sidebar-name');
  const sidebarEmail = document.getElementById('profile-sidebar-email');
  const userRankBadge = document.getElementById('profile-rank-badge');

  if (sidebarName) sidebarName.textContent = currentUser.fullname || 'Thành viên TechZone';
  if (sidebarEmail) sidebarEmail.textContent = currentUser.email || (currentUser.username + '@gmail.com');
  if (sidebarAvatar && currentUser.avatar) {
    sidebarAvatar.src = currentUser.avatar;
  }

  // 3. Tính toán đơn hàng hoàn tất, tổng chi tiêu tích lũy và điểm Smember THỰC TẾ
  calculateAndSyncUserStats(currentUser);

  // Form thông tin cá nhân
  const accountInput = document.getElementById('profile-account');
  const fullnameInput = document.getElementById('profile-fullname');
  const phoneInput = document.getElementById('profile-phone');
  const birthdayInput = document.getElementById('profile-birthday');
  const cityInput = document.getElementById('profile-city');
  const districtInput = document.getElementById('profile-district');
  const addressInput = document.getElementById('profile-address');

  if (accountInput) accountInput.value = currentUser.email || currentUser.username || '';
  if (fullnameInput) fullnameInput.value = currentUser.fullname || '';
  if (phoneInput) phoneInput.value = currentUser.phone || '';
  if (birthdayInput && currentUser.birthday) birthdayInput.value = currentUser.birthday;
  if (cityInput && currentUser.city) cityInput.value = currentUser.city;
  if (districtInput && currentUser.district) districtInput.value = currentUser.district;
  if (addressInput && currentUser.addressDetail) addressInput.value = currentUser.addressDetail;

  // Giới tính
  const currentGender = currentUser.gender || 'nam';
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  genderRadios.forEach(radio => {
    if (radio.value === currentGender) {
      radio.checked = true;
    }
  });

  // 3. Upload / Đổi Avatar bằng FileReader
  const avatarInput = document.getElementById('profile-avatar-input');
  if (avatarInput) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WebP)!', 'warning', 'Định dạng sai');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        showToast('Kích thước ảnh tối đa là 2MB!', 'warning', 'Ảnh quá lớn');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Img = event.target.result;
        if (sidebarAvatar) sidebarAvatar.src = base64Img;

        // Lưu vào currentUser và registeredUsers
        currentUser.avatar = base64Img;
        Auth.setCurrentUser(currentUser);

        const users = Auth.getRegisteredUsers();
        const userIdx = users.findIndex(u => (u.email && u.email.toLowerCase() === (currentUser.email || '').toLowerCase()) || (u.username === currentUser.username));
        if (userIdx !== -1) {
          users[userIdx].avatar = base64Img;
          localStorage.setItem(Auth.STORAGE_USERS_KEY, JSON.stringify(users));
        }

        showToast('Cập nhật ảnh đại diện thành công!', 'success', 'Thành công');
      };
      reader.readAsDataURL(file);
    });
  }

  // 4. Submit form cập nhật thông tin cá nhân
  const profileForm = document.getElementById('tz-profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedFullname = fullnameInput ? fullnameInput.value.trim() : '';
      const updatedPhone = phoneInput ? phoneInput.value.trim() : '';
      const updatedBirthday = birthdayInput ? birthdayInput.value : '';
      const updatedCity = cityInput ? cityInput.value.trim() : '';
      const updatedDistrict = districtInput ? districtInput.value.trim() : '';
      const updatedAddress = addressInput ? addressInput.value.trim() : '';

      let selectedGender = 'nam';
      const checkedGender = document.querySelector('input[name="gender"]:checked');
      if (checkedGender) selectedGender = checkedGender.value;

      if (!updatedFullname) {
        showToast('Họ và tên không được để trống!', 'warning', 'Thiếu thông tin');
        if (fullnameInput) fullnameInput.focus();
        return;
      }

      if (updatedPhone && !/^[0-9]{10}$/.test(updatedPhone)) {
        showToast('Số điện thoại phải gồm đúng 10 chữ số!', 'warning', 'Số điện thoại sai');
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Cập nhật đối tượng currentUser
      currentUser.fullname = updatedFullname;
      currentUser.name = updatedFullname;
      currentUser.phone = updatedPhone;
      currentUser.gender = selectedGender;
      currentUser.birthday = updatedBirthday;
      currentUser.city = updatedCity;
      currentUser.district = updatedDistrict;
      currentUser.addressDetail = updatedAddress;

      Auth.setCurrentUser(currentUser);

      // Cập nhật trong danh sách 'registeredUsers'
      const users = Auth.getRegisteredUsers();
      const userIdx = users.findIndex(u => (u.email && u.email.toLowerCase() === (currentUser.email || '').toLowerCase()) || (u.username === currentUser.username));
      if (userIdx !== -1) {
        users[userIdx].fullname = updatedFullname;
        users[userIdx].phone = updatedPhone;
        users[userIdx].gender = selectedGender;
        users[userIdx].birthday = updatedBirthday;
        users[userIdx].city = updatedCity;
        users[userIdx].district = updatedDistrict;
        users[userIdx].addressDetail = updatedAddress;
        localStorage.setItem(Auth.STORAGE_USERS_KEY, JSON.stringify(users));
      }

      // Cập nhật text hiển thị ngay lập tức
      if (sidebarName) sidebarName.textContent = updatedFullname;
      const headerNameDisplay = document.getElementById('tz-user-name-display');
      if (headerNameDisplay) headerNameDisplay.textContent = updatedFullname;
      const headerGreeting = document.getElementById('tz-dropdown-greeting');
      if (headerGreeting) headerGreeting.textContent = `Xin chào, ${updatedFullname}!`;

      showToast('Thông tin hồ sơ cá nhân đã được lưu thành công!', 'success', 'Cập nhật thành công');
    });
  }

  // 5. Khởi tạo chức năng Đổi mật khẩu
  initPasswordToggles();
  const passForm = document.getElementById('tz-change-password-form');
  if (passForm) {
    passForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const oldPassInput = document.getElementById('profile-old-pass');
      const newPassInput = document.getElementById('profile-new-pass');
      const confirmPassInput = document.getElementById('profile-confirm-new-pass');

      const oldPass = oldPassInput ? oldPassInput.value.trim() : '';
      const newPass = newPassInput ? newPassInput.value.trim() : '';
      const confirmPass = confirmPassInput ? confirmPassInput.value.trim() : '';

      if (!oldPass || !newPass || !confirmPass) {
        showToast('Vui lòng điền đầy đủ cả 3 trường mật khẩu!', 'warning', 'Chưa đủ thông tin');
        return;
      }

      // Lấy mật khẩu thực tế từ registeredUsers
      const users = Auth.getRegisteredUsers();
      const currentInList = users.find(u => (u.email && u.email.toLowerCase() === (currentUser.email || '').toLowerCase()) || (u.username === currentUser.username));
      const registeredPassword = currentInList ? currentInList.password : (currentUser.password || '123');

      // Kiểm tra mật khẩu cũ
      if (registeredPassword && oldPass !== registeredPassword) {
        showToast('Mật khẩu hiện tại không chính xác! Vui lòng thử lại.', 'error', 'Sai mật khẩu');
        if (oldPassInput) oldPassInput.focus();
        return;
      }

      if (newPass.length < 6) {
        showToast('Mật khẩu mới phải có tối thiểu 6 ký tự!', 'warning', 'Mật khẩu quá ngắn');
        if (newPassInput) newPassInput.focus();
        return;
      }

      if (newPass !== confirmPass) {
        showToast('Mật khẩu mới và xác nhận mật khẩu không khớp!', 'error', 'Mật khẩu không khớp');
        if (confirmPassInput) confirmPassInput.focus();
        return;
      }

      if (oldPass === newPass) {
        showToast('Mật khẩu mới không được trùng với mật khẩu cũ!', 'warning', 'Trùng mật khẩu');
        return;
      }

      // Lưu mật khẩu mới vào registeredUsers và currentUser
      if (currentInList) {
        currentInList.password = newPass;
        localStorage.setItem(Auth.STORAGE_USERS_KEY, JSON.stringify(users));
      }
      currentUser.password = newPass;
      Auth.setCurrentUser(currentUser);

      passForm.reset();
      showToast('Đổi mật khẩu tài khoản thành công!', 'success', 'Thành công!');
    });
  }

  // 6. Chuyển tab Sidebar Profile mượt mà
  const navTabs = document.querySelectorAll('.tz-profile-nav-item[data-tab]');
  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const tabTarget = tab.getAttribute('data-tab');
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (tabTarget === 'password') {
        const passCard = document.getElementById('section-password-change');
        if (passCard) passCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (tabTarget === 'profile') {
        const profileCard = document.getElementById('section-profile-info');
        if (profileCard) profileCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (tabTarget === 'address') {
        const addressEl = document.getElementById('profile-address');
        if (addressEl) {
          addressEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          addressEl.focus();
        }
      }
    });
  });

  // 7. Nút Đăng xuất ở Sidebar
  const sidebarLogout = document.getElementById('btn-sidebar-logout');
  if (sidebarLogout) {
    sidebarLogout.onclick = (e) => {
      e.preventDefault();
      openLogoutModal();
    };
  }
}

// ==========================================================================
// EVENT DELEGATION: TOÀN BỘ SỰ KIỆN CLICK CHO GOOGLE POPUP & NỀN TẢNG MXH
// (ĐẢM BẢO 100% KHÔNG BỊ ĐỨNG, CLICK LÀ THỰC THI NGAY)
// ==========================================================================
if (!window._globalModalDelegationBound) {
  window._globalModalDelegationBound = true;

  document.addEventListener('click', (e) => {
    // 1. Click chọn tài khoản Google mẫu (Nguyễn Văn An, Trần Thị Mai...)
    const googleAccountItem = e.target.closest('.google-account-item:not(.google-custom-toggle)');
    if (googleAccountItem) {
      e.preventDefault();
      e.stopPropagation();
      const fn = googleAccountItem.getAttribute('data-fullname') || googleAccountItem.querySelector('.google-user-name')?.textContent?.trim();
      const em = googleAccountItem.getAttribute('data-email') || googleAccountItem.querySelector('.google-user-email')?.textContent?.trim();
      if (fn && em) {
        loginWithSocialPlatform('Google', fn, em);
      }
      return;
    }

    // 2. Click nút Toggle Form tài khoản Google khác
    const googleToggleBtn = e.target.closest('#btn-toggle-custom-google, .google-custom-toggle');
    if (googleToggleBtn) {
      e.preventDefault();
      e.stopPropagation();
      const modal = document.getElementById('tz-google-modal');
      if (modal) {
        const customForm = modal.querySelector('#form-custom-google');
        const arrowIcon = modal.querySelector('#google-arrow-toggle');
        if (customForm) {
          const isHidden = customForm.style.display === 'none' || !customForm.style.display;
          customForm.style.display = isHidden ? 'block' : 'none';
          if (arrowIcon) {
            arrowIcon.className = isHidden ? 'fa-solid fa-angle-up google-arrow' : 'fa-solid fa-angle-down google-arrow';
          }
          if (isHidden) {
            const inputName = customForm.querySelector('#google-custom-name');
            if (inputName) inputName.focus();
          }
        }
      }
      return;
    }

    // 3. Click nút Submit form tài khoản Google khác
    const googleSubmitBtn = e.target.closest('.btn-submit-google-custom');
    if (googleSubmitBtn) {
      e.preventDefault();
      e.stopPropagation();
      const modal = document.getElementById('tz-google-modal');
      if (modal) {
        const customForm = modal.querySelector('#form-custom-google');
        if (customForm) {
          const nameInput = customForm.querySelector('#google-custom-name');
          const emailInput = customForm.querySelector('#google-custom-email');
          const fn = nameInput ? nameInput.value.trim() : '';
          const em = emailInput ? emailInput.value.trim() : '';
          if (!fn || !em) {
            showToast('Vui lòng nhập đầy đủ Họ tên và Gmail của bạn!', 'warning', 'Thiếu thông tin');
            if (nameInput && !fn) nameInput.focus();
            else if (emailInput && !em) emailInput.focus();
            return;
          }
          loginWithSocialPlatform('Google', fn, em);
        }
      }
      return;
    }

    // 4. Click nút Hủy bỏ / Đóng modal Google
    const googleCloseBtn = e.target.closest('#btn-close-google-modal, .btn-cancel-google');
    if (googleCloseBtn) {
      e.preventDefault();
      e.stopPropagation();
      closeAllSocialModals();
      return;
    }

    // 5. Click đóng khi nhấp vào lớp nền overlay
    if (e.target.classList && e.target.classList.contains('tz-modal-overlay')) {
      closeAllSocialModals();
      closeLogoutModal();
      return;
    }
  });

  // Global ESC to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllSocialModals();
      closeLogoutModal();
    }
  });
}

// Handler cho các nút Mạng xã hội (Bật Popup chuyên biệt từng nền tảng: Google, Facebook, Zalo, Apple)
function initSocialAuthHandlers(actionType) {
  // 1. Google
  const googleBtns = document.querySelectorAll('.tz-btn-social-item.social-google, [data-provider="Google"]');
  googleBtns.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      openGoogleModal();
    };
  });

  // 2. Facebook
  const fbBtns = document.querySelectorAll('.tz-btn-social-item.social-facebook, [data-provider="Facebook"]');
  fbBtns.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      openFacebookModal();
    };
  });

  // 3. Zalo
  const zaloBtns = document.querySelectorAll('.tz-btn-social-item.social-zalo, [data-provider="Zalo"]');
  zaloBtns.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      openZaloModal();
    };
  });

  // 4. Apple
  const appleBtns = document.querySelectorAll('.tz-btn-social-item.social-apple, [data-provider="Apple"]');
  appleBtns.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      openAppleModal();
    };
  });
}

// --- 15. GLOBAL DISPATCHER (DOM CONTENT LOADED) ---
document.addEventListener('DOMContentLoaded', () => {
  if (typeof TZ !== 'undefined' && TZ.init) TZ.init();
  guardGoogleLoginModals();
  initPageLoader();
  Storage.updateCartBadge();
  updateGlobalVoucherBadges();
  initStickyHeader();
  initUserAccount();
  initLocationSelector();
  initCategoryDropdown();

  // Tự động kích hoạt hiển thị Toast chào mừng nếu vừa chuyển hướng từ Đăng nhập / Đăng ký
  try {
    const flashRaw = sessionStorage.getItem('techzone_toast_flash');
    if (flashRaw && !window._techzone_flash_shown) {
      window._techzone_flash_shown = true;
      sessionStorage.removeItem('techzone_toast_flash');
      const flash = JSON.parse(flashRaw);
      setTimeout(() => {
        showToast(flash.message, flash.type || 'success', flash.title || 'Thành công!');
      }, 350);
    }
  } catch (err) {}

  // Header Global Search input Enter key
  const globalSearchInput = document.getElementById('header-global-search');
  if (globalSearchInput) {
    globalSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = globalSearchInput.value.trim();
        if (q) window.location.href = `products.html?q=${encodeURIComponent(q)}`;
      }
    });
  }

  // Dual-check: Detect current page via pathname or specific DOM markers
  const pathname = window.location.pathname.toLowerCase();

  // Khởi tạo Nút CSKH & Gọi điện nổi góc dưới bên trái (Floating Support Widget) trên mọi page
  initFloatingSupportWidget();

  if (pathname.includes('login') || document.getElementById('tz-login-form')) {
    initLoginPage();
  } else if (pathname.includes('complete-profile') || document.getElementById('tz-complete-profile-form')) {
    initCompleteProfilePage();
  } else if (pathname.includes('register') || document.getElementById('tz-register-form')) {
    initRegisterPage();
  } else if (pathname.includes('profile') || document.getElementById('tz-profile-form')) {
    initProfilePage();
  } else if (pathname.includes('product-detail') || document.getElementById('tz-product-detail-view')) {
    initProductDetailPage();
  } else if (pathname.includes('products') || document.getElementById('catalog-products-grid')) {
    initProductsPage();
  } else if (pathname.includes('checkout') || document.getElementById('tz-checkout-form')) {
    initCheckoutPage();
  } else if (pathname.includes('tracking') || document.querySelector('.order-timeline')) {
    initTrackingDetailPage();
  } else if (pathname.includes('voucher') || document.getElementById('vouchers-grid-container')) {
    initVouchersPage();
  } else if (pathname.includes('history') || document.getElementById('history-cards-container')) {
    initHistoryPage();
  } else {
    initHomePage();
  }
});


// --- 14. CUSTOM MODAL HỦY ĐƠN HÀNG (ORDER CANCELLATION MODAL & LOGIC) ---
function ensureCancelOrderModal() {
  let modal = document.getElementById('tz-cancel-order-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'tz-modal-overlay';
    modal.id = 'tz-cancel-order-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'tz-cancel-modal-title');
    modal.innerHTML = `
      <div class="tz-modal-content tz-cancel-modal-content" style="max-width: 520px; text-align: left; padding: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #fee2e2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h3 id="tz-cancel-modal-title" style="font-size: 1.15rem; font-weight: 800; color: #1e293b; margin: 0;">Lý Do Hủy Đơn Hàng</h3>
              <span style="font-size: 0.8rem; color: #64748b;">Mã đơn: <strong id="cancel-modal-order-id" style="color: #ee4d2d;"></strong></span>
            </div>
          </div>
          <button type="button" id="btn-close-cancel-modal" style="background: none; border: none; font-size: 1.25rem; color: #94a3b8; cursor: pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <p style="font-size: 0.88rem; color: #475569; margin-bottom: 14px;">
          Vui lòng chọn lý do bạn muốn hủy đơn hàng này để Shopee TechZone cải thiện dịch vụ tốt hơn:
        </p>

        <div class="cancel-reasons-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
          <label class="cancel-reason-option">
            <input type="radio" name="cancel_reason" value="Thay đổi địa chỉ nhận hàng" checked>
            <span>Thay đổi địa chỉ nhận hàng</span>
          </label>
          <label class="cancel-reason-option">
            <input type="radio" name="cancel_reason" value="Muốn đổi phương thức thanh toán / sản phẩm khác">
            <span>Muốn đổi phương thức thanh toán / sản phẩm khác</span>
          </label>
          <label class="cancel-reason-option">
            <input type="radio" name="cancel_reason" value="Tìm thấy giá rẻ hơn ở nơi khác">
            <span>Tìm thấy giá rẻ hơn ở nơi khác</span>
          </label>
          <label class="cancel-reason-option">
            <input type="radio" name="cancel_reason" value="Thời gian giao hàng quá lâu">
            <span>Thời gian giao hàng quá lâu</span>
          </label>
          <label class="cancel-reason-option">
            <input type="radio" name="cancel_reason" value="Đổi ý không muốn mua nữa">
            <span>Đổi ý không muốn mua nữa</span>
          </label>
          <label class="cancel-reason-option">
            <input type="radio" name="cancel_reason" value="other" id="cancel-reason-other-radio">
            <span>Lý do khác...</span>
          </label>
        </div>

        <div id="cancel-other-reason-wrap" style="display: none; margin-bottom: 16px;">
          <textarea id="cancel-other-reason-input" class="tz-input" rows="3" placeholder="Nhập chi tiết lý do bạn muốn hủy đơn..." style="resize: vertical; font-size: 0.88rem;"></textarea>
        </div>

        <div style="background: #fff7ed; border-left: 3px solid #f97316; padding: 10px 14px; border-radius: 6px; font-size: 0.82rem; color: #9a3412; margin-bottom: 20px;">
          <i class="fa-solid fa-circle-exclamation"></i> Sau khi hủy, đơn hàng sẽ không thể khôi phục lại. Bạn có thể tiến hành đặt lại sản phẩm bất cứ lúc nào.
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" id="btn-cancel-modal-dismiss" class="btn-shopee-secondary" style="padding: 9px 18px; font-size: 0.88rem;">
            Không phải bây giờ
          </button>
          <button type="button" id="btn-confirm-cancel-order" class="btn-shopee-cancel-submit" style="padding: 9px 20px; font-size: 0.88rem; background: #dc2626; color: white; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;">
            <i class="fa-solid fa-ban"></i> Xác nhận hủy đơn
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Bind radio changes
    const radios = modal.querySelectorAll('input[name="cancel_reason"]');
    const otherWrap = modal.querySelector('#cancel-other-reason-wrap');
    radios.forEach(r => {
      r.onchange = () => {
        if (otherWrap) otherWrap.style.display = r.value === 'other' ? 'block' : 'none';
      };
    });

    // Close handlers
    modal.querySelector('#btn-close-cancel-modal').onclick = () => closeCancelOrderModal();
    modal.querySelector('#btn-cancel-modal-dismiss').onclick = () => closeCancelOrderModal();
    modal.onclick = (e) => {
      if (e.target === modal) closeCancelOrderModal();
    };
  }
  return modal;
}

let activeCancelOrderId = null;
let activeCancelCallback = null;

function openCancelOrderModal(orderId, onSuccessCallback = null) {
  const modal = ensureCancelOrderModal();
  activeCancelOrderId = orderId;
  activeCancelCallback = onSuccessCallback;

  const idSpan = modal.querySelector('#cancel-modal-order-id');
  if (idSpan) idSpan.textContent = '#' + orderId;

  // Reset radio & textarea
  const firstRadio = modal.querySelector('input[name="cancel_reason"][value="Thay đổi địa chỉ nhận hàng"]');
  if (firstRadio) firstRadio.checked = true;
  const otherWrap = modal.querySelector('#cancel-other-reason-wrap');
  if (otherWrap) otherWrap.style.display = 'none';
  const otherInput = modal.querySelector('#cancel-other-reason-input');
  if (otherInput) otherInput.value = '';

  const confirmBtn = modal.querySelector('#btn-confirm-cancel-order');
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      let reason = 'Thay đổi ý định';
      const checkedRadio = modal.querySelector('input[name="cancel_reason"]:checked');
      if (checkedRadio) {
        if (checkedRadio.value === 'other') {
          reason = otherInput?.value.trim() || 'Lý do cá nhân khác';
        } else {
          reason = checkedRadio.value;
        }
      }
      executeCancelOrder(activeCancelOrderId, reason, activeCancelCallback);
    };
  }

  modal.classList.add('show');
}

function closeCancelOrderModal() {
  const modal = document.getElementById('tz-cancel-order-modal');
  if (modal) modal.classList.remove('show');
  activeCancelOrderId = null;
}

function executeCancelOrder(orderId, reason, callback = null) {
  const orders = Storage.getOrders();
  const order = orders.find(o => o.id === orderId || (o.aliases && o.aliases.includes(orderId)));
  if (!order) {
    showToast('Không tìm thấy đơn hàng cần hủy!', 'error');
    closeCancelOrderModal();
    return;
  }

  // Update order status
  order.status = 'Đã hủy';
  order.cancelReason = reason;
  order.cancelDate = new Date().toLocaleString('vi-VN', { hour12: false });
  order.etaText = `Đã hủy vào ${order.cancelDate} (Lý do: ${reason})`;

  if (!Array.isArray(order.checkpoints)) order.checkpoints = [];
  order.checkpoints.unshift({
    time: 'Vừa xong',
    text: `Đơn hàng đã được hủy bởi người mua. Lý do: "${reason}".`
  });

  Storage.saveOrders(orders);
  closeCancelOrderModal();
  showToast(`Đã hủy đơn hàng <strong>#${order.id}</strong> thành công!`, 'success');

  // Tự động tính toán lại và trừ số tiền/điểm tương ứng khỏi hồ sơ cá nhân ngay lập tức
  const currentUser = Auth.getUser();
  if (currentUser) {
    calculateAndSyncUserStats(currentUser);
  }

  if (typeof callback === 'function') {
    callback(order);
  }
}


// ==========================================================================
// PROMPT 53: TRANG CHI TIẾT SẢN PHẨM (product-detail.html) & NÚT CSKH NỔI
// ==========================================================================

// --- 16. PAGE LOGIC: PRODUCT DETAIL (product-detail.html) ---
function initProductDetailPage() {
  const container = document.getElementById('tz-product-detail-view');
  if (!container) return;

  // Khắc phục triệt để lỗi bung popup Google khi cuộn trang:
  // Nếu đã đăng nhập hoặc trang vừa tải, ẩn triệt để mọi modal Google Login
  guardGoogleLoginModals();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'sp1';
  const products = Storage.getProducts();
  const product = products.find(p => p.id === productId) || products[0];

  if (!product) return;

  // 1. Cập nhật Title trang và Breadcrumb
  document.title = `${product.name} | TechZone Chính Hãng`;
  const pageTitleElem = document.getElementById('pd-page-title');
  if (pageTitleElem) pageTitleElem.textContent = `${product.name} | TechZone Chính Hãng`;

  const breadcrumbCat = document.getElementById('breadcrumb-category');
  if (breadcrumbCat) {
    const catNames = {
      phone: 'Điện thoại & Tablet',
      laptop: 'Laptop & Màn hình',
      audio: 'Thiết bị Âm thanh',
      watch: 'Đồng hồ thông minh',
      accessory: 'Phụ kiện sạc cáp'
    };
    const catTitle = catNames[product.category] || 'Sản phẩm';
    breadcrumbCat.textContent = catTitle;
    breadcrumbCat.href = `products.html?category=${product.category}`;
  }

  const breadcrumbName = document.getElementById('breadcrumb-product-name');
  if (breadcrumbName) breadcrumbName.textContent = product.name;

  // 2. Cột trái: Ảnh chính & Zoom tương tác
  const mainImg = document.getElementById('tz-pd-main-image');
  const zoomBox = document.getElementById('tz-pd-zoom-box');
  if (mainImg) {
    mainImg.src = product.image;
    mainImg.alt = product.name;
  }

  // Hiệu ứng Zoom mượt mà khi rê chuột vào ảnh chính
  if (zoomBox && mainImg) {
    zoomBox.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 768) return; // Vô hiệu hóa hiệu ứng rê chuột zoom trên màn hình cảm ứng di động
      const rect = zoomBox.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = Math.round((x / rect.width) * 100);
      const yPct = Math.round((y / rect.height) * 100);
      mainImg.style.transformOrigin = `${xPct}% ${yPct}%`;
      mainImg.style.transform = 'scale(1.55)';
    });

    zoomBox.addEventListener('mouseleave', () => {
      mainImg.style.transformOrigin = 'center center';
      mainImg.style.transform = 'scale(1)';
    });
  }

  // Huy hiệu sản phẩm hàng ngang: Giảm giá, Trả góp 0%, Chính hãng 100%
  const badgesBox = document.getElementById('tz-pd-badges');
  if (badgesBox) {
    const discountVal = product.discountPercent || (product.originalPrice && product.price ? Math.round((product.originalPrice - product.price) / product.originalPrice * 100) : 18);
    badgesBox.innerHTML = `
      ${discountVal > 0 ? `<span class="tz-badge-pill tz-badge-discount"><i class="fa-solid fa-bolt"></i> Giảm ${discountVal}%</span>` : ''}
      <span class="tz-badge-pill tz-badge-installment"><i class="fa-solid fa-credit-card"></i> Trả góp 0%</span>
      <span class="tz-badge-pill tz-badge-official"><i class="fa-solid fa-shield-halved"></i> Chính hãng 100%</span>
    `;
  }

  // Hàng ảnh thumbnail góc khác
  const thumbsList = document.getElementById('tz-pd-thumbs-list');
  if (thumbsList) {
    const allProdImages = products.filter(p => p.id !== product.id).map(p => p.image);
    const thumbImages = [
      product.image,
      allProdImages[0] || 'images/sp2.jpg',
      allProdImages[1] || 'images/sp3.jpg',
      allProdImages[2] || 'images/sp4.jpg',
      allProdImages[3] || 'images/sp5.jpg'
    ];

    const thumbLabels = ['Góc chính diện', 'Góc nghiêng 45°', 'Chi tiết linh kiện', 'Khui hộp & Seal', 'Ảnh thực tế'];

    thumbsList.innerHTML = thumbImages.map((imgSrc, idx) => `
      <div class="tz-pd-thumb-item ${idx === 0 ? 'active' : ''}" data-src="${imgSrc}" title="${thumbLabels[idx]}">
        <img src="${imgSrc}" alt="${thumbLabels[idx]}" loading="lazy">
        <span class="thumb-label">${thumbLabels[idx]}</span>
      </div>
    `).join('');

    const thumbItems = thumbsList.querySelectorAll('.tz-pd-thumb-item');
    thumbItems.forEach(item => {
      item.addEventListener('click', () => {
        thumbItems.forEach(t => t.classList.remove('active'));
        item.classList.add('active');
        const newSrc = item.dataset.src;
        if (mainImg) {
          mainImg.style.opacity = '0.4';
          setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.opacity = '1';
          }, 120);
        }
      });
    });
  }

  // 3. Cột phải: Thông tin chi tiết sản phẩm
  const brandElem = document.getElementById('tz-pd-brand');
  if (brandElem) brandElem.innerHTML = `<i class="fa-solid fa-tag"></i> Thương hiệu: <strong>${product.brand || 'TechZone'}</strong>`;

  const skuElem = document.getElementById('tz-pd-sku');
  if (skuElem) skuElem.textContent = `Mã SP: ${product.id.toUpperCase()}-TZ`;

  const titleElem = document.getElementById('tz-pd-title');
  if (titleElem) titleElem.textContent = product.name;

  // Rating, Review Count, Sold Count riêng biệt của sản phẩm
  const prodRating = product.rating || 4.9;
  const prodReviewCount = product.reviewCount || 1248;
  const prodSoldCount = product.soldCount || '2.4k';

  const starsElem = document.getElementById('tz-pd-stars');
  if (starsElem) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(prodRating)) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
      } else if (i - prodRating <= 0.5) {
        starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
      } else {
        starsHtml += '<i class="fa-regular fa-star"></i>';
      }
    }
    starsElem.innerHTML = `${starsHtml} <span class="tz-pd-score">${prodRating.toFixed(1)} / 5</span>`;
  }

  const reviewCountElem = document.getElementById('tz-pd-review-count');
  if (reviewCountElem) {
    reviewCountElem.innerHTML = `<i class="fa-regular fa-comment-dots"></i> ${prodReviewCount.toLocaleString()} Đánh giá`;
  }

  const soldCountElem = document.getElementById('tz-pd-sold-count');
  if (soldCountElem) {
    soldCountElem.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> Đã bán ${prodSoldCount}`;
  }

  const currentPriceVal = product.price || 0;
  const oldPriceVal = product.originalPrice || product.oldPrice || Math.round(currentPriceVal * 1.15);
  const discountVal = product.discountPercent || Math.max(5, Math.round(((oldPriceVal - currentPriceVal) / oldPriceVal) * 100));

  const priceCurrentElem = document.getElementById('tz-pd-price-current');
  if (priceCurrentElem) priceCurrentElem.textContent = formatVND(currentPriceVal);

  const priceOldElem = document.getElementById('tz-pd-price-old');
  if (priceOldElem) priceOldElem.textContent = formatVND(oldPriceVal);

  const discountBadgeElem = document.getElementById('tz-pd-discount-badge');
  if (discountBadgeElem) discountBadgeElem.textContent = `Giảm ${discountVal}%`;

  const savingsElem = document.getElementById('tz-pd-savings');
  if (savingsElem) {
    const diff = Math.max(0, oldPriceVal - currentPriceVal);
    savingsElem.innerHTML = `<i class="fa-solid fa-piggy-bank"></i> Tiết kiệm: <strong>${formatVND(diff)}</strong> khi mua hôm nay`;
  }

  // Bảng thông số kỹ thuật nổi bật
  const specsGrid = document.getElementById('tz-pd-specs-grid');
  if (specsGrid) {
    const specsList = product.specs && product.specs.length ? product.specs : [
      'Bảo hành 12 tháng chính hãng',
      'Đổi mới trong 30 ngày nếu lỗi',
      'Nguyên hộp kèm phụ kiện chính hãng',
      'Miễn phí cài đặt phần mềm trọn đời'
    ];
    specsGrid.innerHTML = specsList.map(s => `
      <div class="tz-spec-pill-item">
        <i class="fa-solid fa-check"></i>
        <span>${s}</span>
      </div>
    `).join('');
  }

  // Mô tả sản phẩm
  const descElem = document.getElementById('tz-pd-desc-text');
  if (descElem) {
    descElem.innerHTML = `
      ${product.description || 'Sản phẩm công nghệ cao cấp chính hãng phân phối tại hệ thống TechZone, bảo đảm đầy đủ chứng nhận CO/CQ và tiêu chuẩn chất lượng nghiêm ngặt.'}
      <br><br>
      • <strong>Cam kết chất lượng:</strong> 100% hàng mới nguyên seal, chưa qua kích hoạt, xuất hóa đơn VAT điện tử đầy đủ.<br>
      • <strong>Dịch vụ hỗ trợ:</strong> Đội ngũ kỹ thuật viên giàu kinh nghiệm hỗ trợ cài đặt, sao lưu dữ liệu và tư vấn 24/7.<br>
      • <strong>Vận chuyển hỏa tốc:</strong> Đối tác độc quyền Shopee Express (SPX) cam kết giao tận tay chỉ từ 2 giờ tại các thành phố lớn.
    `;
  }

  // Chọn màu sắc
  const variantBtns = document.querySelectorAll('.tz-variant-btn');
  const variantLabel = document.getElementById('tz-pd-selected-variant');
  variantBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      variantBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (variantLabel) variantLabel.textContent = btn.dataset.color || 'Mặc định';
    });
  });

  // Chọn số lượng
  const qtyInput = document.getElementById('input-pd-quantity');
  const btnMinus = document.getElementById('btn-qty-minus');
  const btnPlus = document.getElementById('btn-qty-plus');
  const maxStock = product.totalStock || 100;

  const stockText = document.getElementById('tz-pd-stock-text');
  if (stockText) stockText.textContent = `Còn lại ${maxStock} sản phẩm có sẵn trong kho`;

  if (btnMinus && qtyInput) {
    btnMinus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) {
        qtyInput.value = val - 1;
      }
    });
  }

  if (btnPlus && qtyInput) {
    btnPlus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val < maxStock) {
        qtyInput.value = val + 1;
      } else {
        showToast(`Số lượng tối đa có thể mua là ${maxStock} sản phẩm!`, 'info');
      }
    });
  }

  // 4. RÀNG BUỘC ĐĂNG NHẬP CHO 2 NÚT HÀNH ĐỘNG
  const btnAddCart = document.getElementById('btn-pd-add-cart');
  const btnBuyNow = document.getElementById('btn-pd-buy-now');

  if (btnAddCart) {
    btnAddCart.addEventListener('click', () => {
      const currentUser = Auth.getUser();
      if (!currentUser) {
        showToast('Vui lòng đăng nhập tài khoản để thêm sản phẩm vào giỏ hàng!', 'warning', 'Yêu cầu đăng nhập');
        setTimeout(() => {
          openGoogleModal();
        }, 300);
        return;
      }

      const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
      Storage.addToCart(product, qty);
      showToast(`Đã thêm thành công <strong>${qty}</strong> x <strong>${product.name}</strong> vào giỏ hàng!`, 'success', 'Thêm vào giỏ');
    });
  }

  if (btnBuyNow) {
    btnBuyNow.addEventListener('click', () => {
      const currentUser = Auth.getUser();
      if (!currentUser) {
        showToast('Vui lòng đăng nhập tài khoản trước khi tiến hành mua ngay!', 'warning', 'Yêu cầu đăng nhập');
        setTimeout(() => {
          openGoogleModal();
        }, 300);
        return;
      }

      const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
      Storage.addToCart(product, qty);
      showToast('Đang chuyển hướng sang trang thanh toán...', 'info');
      setTimeout(() => {
        window.location.href = 'checkout.html';
      }, 500);
    });
  }

  // 5. KHỐI ĐÁNH GIÁ & BÌNH LUẬN (REVIEWS & COMMENTS)
  initProductReviews(product);

  // 6. SẢN PHẨM TƯƠNG TỰ BẠN CÓ THỂ THÍCH
  const relatedGrid = document.getElementById('tz-related-products-grid');
  if (relatedGrid) {
    const relatedList = products
      .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
      .slice(0, 4);
    
    if (relatedList.length < 4) {
      const more = products.filter(p => p.id !== product.id && !relatedList.some(r => r.id === p.id)).slice(0, 4 - relatedList.length);
      relatedList.push(...more);
    }

    relatedGrid.innerHTML = relatedList.map(p => renderTechZoneProductCard(p, false)).join('');
    bindProductActions(relatedGrid);
  }

  // 7. Sắp xếp lại thứ tự khối Cam kết dịch vụ trên di động (< 768px)
  function adjustMobileProductLayout() {
    const trustBox = document.querySelector('.tz-pd-trust-box');
    const actionsRow = document.querySelector('.tz-pd-actions-row');
    const authNote = document.querySelector('.tz-pd-auth-note');
    const leftColGallery = document.querySelector('.tz-pd-gallery');

    if (window.innerWidth <= 768) {
      if (trustBox && (authNote || actionsRow)) {
        const anchor = authNote || actionsRow;
        if (anchor.nextElementSibling !== trustBox) {
          anchor.parentNode.insertBefore(trustBox, anchor.nextSibling);
        }
      }
    } else {
      if (trustBox && leftColGallery && !leftColGallery.contains(trustBox)) {
        leftColGallery.appendChild(trustBox);
      }
    }
  }

  adjustMobileProductLayout();
  window.addEventListener('resize', adjustMobileProductLayout);
}

// --- 16.1 REVIEWS & COMMENTS LOGIC ---
function initProductReviews(product) {
  const reviewsCard = document.getElementById('tz-add-review-card');
  const reviewsList = document.getElementById('tz-reviews-list');
  const reviewsBadge = document.getElementById('tz-reviews-badge');
  const summaryReviewsText = document.getElementById('summary-total-reviews');
  const summaryScoreVal = document.getElementById('summary-score-val');
  const summaryScoreStars = document.getElementById('summary-score-stars');

  if (!reviewsList) return;

  const storageKey = `tz_reviews_${product.id}`;
  const prodRating = product.rating || 4.9;
  const prodReviewCount = product.reviewCount || 1248;

  // Cập nhật điểm sao to và icon sao trong summary card
  if (summaryScoreVal) {
    summaryScoreVal.innerHTML = `${prodRating.toFixed(1)}<span class="max-score">/5</span>`;
  }
  if (summaryScoreStars) {
    let sHtml = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(prodRating)) {
        sHtml += '<i class="fa-solid fa-star"></i>';
      } else if (i - prodRating <= 0.5) {
        sHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
      } else {
        sHtml += '<i class="fa-regular fa-star"></i>';
      }
    }
    summaryScoreStars.innerHTML = sHtml;
  }

  // Cập nhật các thanh tỷ lệ phần trăm sao tương ứng với số điểm
  const ratingBarsCol = document.querySelector('.tz-rating-bars-col');
  if (ratingBarsCol) {
    let p5 = 88, p4 = 9, p3 = 2, p2 = 1, p1 = 0;
    if (prodRating >= 4.9) {
      p5 = 89; p4 = 8; p3 = 2; p2 = 1; p1 = 0;
    } else if (prodRating >= 4.8) {
      p5 = 82; p4 = 14; p3 = 3; p2 = 1; p1 = 0;
    } else if (prodRating >= 4.7) {
      p5 = 75; p4 = 18; p3 = 5; p2 = 2; p1 = 0;
    }
    ratingBarsCol.innerHTML = `
      <div class="rating-bar-row">
        <span class="star-label">5 sao</span>
        <div class="bar-track"><div class="bar-fill" style="width: ${p5}%;"></div></div>
        <span class="bar-pct">${p5}%</span>
      </div>
      <div class="rating-bar-row">
        <span class="star-label">4 sao</span>
        <div class="bar-track"><div class="bar-fill" style="width: ${p4}%;"></div></div>
        <span class="bar-pct">${p4}%</span>
      </div>
      <div class="rating-bar-row">
        <span class="star-label">3 sao</span>
        <div class="bar-track"><div class="bar-fill" style="width: ${p3}%;"></div></div>
        <span class="bar-pct">${p3}%</span>
      </div>
      <div class="rating-bar-row">
        <span class="star-label">2 sao</span>
        <div class="bar-track"><div class="bar-fill" style="width: ${p2}%;"></div></div>
        <span class="bar-pct">${p2}%</span>
      </div>
      <div class="rating-bar-row">
        <span class="star-label">1 sao</span>
        <div class="bar-track"><div class="bar-fill" style="width: ${p1}%;"></div></div>
        <span class="bar-pct">${p1}%</span>
      </div>
    `;
  }

  // Danh sách đánh giá mặc định độc lập của sản phẩm
  const defaultReviews = (product.reviews && product.reviews.length > 0) ? product.reviews : [
    {
      id: `rev_${product.id}_1`,
      author: 'Hoàng Nam',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      stars: 5,
      date: '2 ngày trước',
      variant: 'Chính hãng TechZone',
      comment: `Sản phẩm ${product.name} quá đẹp, nguyên seal chính hãng 100%. Bưu tá SPX giao nhanh trong 2h tại Hà Nội. Rất hài lòng!`,
      likes: 18,
      verified: true
    },
    {
      id: `rev_${product.id}_2`,
      author: 'Lê Thị Bích Ngọc',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      stars: 5,
      date: '5 ngày trước',
      variant: 'Nguyên hộp VAT',
      comment: 'Giao hàng đúng hẹn, màu sắc bên ngoài đẹp hơn cả trên ảnh. Nhân viên tư vấn nhiệt tình, đóng gói chống sốc 3 lớp cẩn thận.',
      likes: 12,
      verified: true
    }
  ];

  function getSavedReviews() {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveReviewToStorage(review) {
    const list = getSavedReviews();
    list.unshift(review);
    localStorage.setItem(storageKey, JSON.stringify(list));
  }

  function renderAllReviews() {
    const userReviews = getSavedReviews();
    const combined = [...userReviews, ...defaultReviews];

    if (reviewsBadge) reviewsBadge.textContent = `(${combined.length} đánh giá)`;
    if (summaryReviewsText) {
      summaryReviewsText.textContent = `Dựa trên ${(prodReviewCount + userReviews.length).toLocaleString()} lượt đánh giá thực tế`;
    }

    reviewsList.innerHTML = combined.map(r => `
      <div class="tz-review-card ${r.isNew ? 'new-review' : ''}">
        <div class="tz-review-header">
          <div class="tz-review-author-info">
            <img src="${r.avatar}" alt="${r.author}" class="tz-review-avatar">
            <div>
              <div class="tz-review-author-name">
                ${r.author}
                ${r.verified ? '<span class="tz-verified-badge"><i class="fa-solid fa-circle-check"></i> Đã mua hàng tại TechZone</span>' : ''}
              </div>
              <div class="tz-review-meta">
                <span class="tz-review-stars">
                  ${Array(r.stars).fill('<i class="fa-solid fa-star"></i>').join('')}
                  ${Array(5 - r.stars).fill('<i class="fa-regular fa-star"></i>').join('')}
                </span>
                <span class="sep">•</span>
                <span class="tz-review-date">${r.date}</span>
                ${r.variant ? `<span class="sep">•</span><span class="tz-review-variant">Phân loại: ${r.variant}</span>` : ''}
              </div>
            </div>
          </div>
        </div>
        <div class="tz-review-body">
          <p class="tz-review-text">${r.comment}</p>
        </div>
        <div class="tz-review-footer">
          <button type="button" class="btn-like-review" onclick="showToast('Cảm ơn bạn đã phản hồi nhận xét hữu ích!', 'info')">
            <i class="fa-regular fa-thumbs-up"></i> Hữu ích (${r.likes || 1})
          </button>
        </div>
      </div>
    `).join('');
  }

  function renderAddReviewForm() {
    if (!reviewsCard) return;

    const currentUser = Auth.getUser();
    if (!currentUser) {
      reviewsCard.innerHTML = `
        <div class="tz-review-login-prompt">
          <div class="prompt-icon"><i class="fa-solid fa-lock"></i></div>
          <div class="prompt-text">
            <h4>Bạn đã sở hữu sản phẩm này?</h4>
            <p>Vui lòng đăng nhập tài khoản TechZone để gửi đánh giá và nhận <strong>+50 điểm Smember</strong>!</p>
          </div>
          <a href="login.html?redirect=product-detail.html?id=${product.id}" class="btn-shopee-primary" style="padding: 9px 20px;">
            <i class="fa-solid fa-right-to-bracket"></i> Đăng nhập ngay
          </a>
        </div>
      `;
      return;
    }

    reviewsCard.innerHTML = `
      <div class="tz-write-review-box">
        <div class="write-header">
          <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}" alt="${currentUser.fullname}" class="user-avatar-mini">
          <div>
            <div class="user-greeting">Đánh giá với tư cách: <strong>${currentUser.fullname || currentUser.username}</strong></div>
            <div class="user-sub">Chia sẻ cảm nhận chân thực để cộng đồng người mua TechZone tham khảo nhé!</div>
          </div>
        </div>

        <form id="tz-form-submit-review" class="tz-review-form">
          <div class="star-rating-picker-row">
            <span class="rating-label">Chọn mức độ hài lòng:</span>
            <div class="star-picker" id="tz-star-picker">
              <i class="fa-solid fa-star star-btn active" data-rating="1"></i>
              <i class="fa-solid fa-star star-btn active" data-rating="2"></i>
              <i class="fa-solid fa-star star-btn active" data-rating="3"></i>
              <i class="fa-solid fa-star star-btn active" data-rating="4"></i>
              <i class="fa-solid fa-star star-btn active" data-rating="5"></i>
              <span class="rating-text" id="tz-rating-desc">Tuyệt vời (5/5 sao)</span>
            </div>
            <input type="hidden" id="input-review-stars" value="5">
          </div>

          <div class="tz-form-group" style="margin-top: 12px;">
            <textarea id="input-review-comment" rows="3" placeholder="Hãy chia sẻ cảm nhận của bạn về chất lượng hoàn thiện máy, hiệu năng, đóng gói chống sốc và dịch vụ giao hàng SPX 2H..." required></textarea>
          </div>

          <div class="tz-review-submit-row">
            <span class="review-tips"><i class="fa-solid fa-shield-halved"></i> Đánh giá sẽ được hiển thị ngay lập tức</span>
            <button type="submit" class="btn-shopee-primary btn-submit-review">
              <i class="fa-solid fa-paper-plane"></i> Gửi Đánh Giá Ngay
            </button>
          </div>
        </form>
      </div>
    `;

    const starsInput = reviewsCard.querySelector('#input-review-stars');
    const ratingDesc = reviewsCard.querySelector('#tz-rating-desc');
    const starBtns = reviewsCard.querySelectorAll('.star-btn');

    const descTexts = {
      1: 'Rất tệ (1/5 sao)',
      2: 'Chưa hài lòng (2/5 sao)',
      3: 'Bình thường (3/5 sao)',
      4: 'Hài lòng (4/5 sao)',
      5: 'Tuyệt vời (5/5 sao)'
    };

    starBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const rating = parseInt(btn.dataset.rating) || 5;
        if (starsInput) starsInput.value = rating;
        if (ratingDesc) ratingDesc.textContent = descTexts[rating];

        starBtns.forEach(s => {
          const sRating = parseInt(s.dataset.rating) || 1;
          if (sRating <= rating) {
            s.classList.add('active');
            s.classList.remove('fa-regular');
            s.classList.add('fa-solid');
          } else {
            s.classList.remove('active');
            s.classList.remove('fa-solid');
            s.classList.add('fa-regular');
          }
        });
      });
    });

    const form = reviewsCard.querySelector('#tz-form-submit-review');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const commentInput = form.querySelector('#input-review-comment');
        const text = commentInput.value.trim();
        if (text.length < 5) {
          showToast('Nội dung nhận xét cần tối thiểu 5 ký tự!', 'warning');
          return;
        }

        const rating = parseInt(starsInput.value) || 5;
        const newReview = {
          id: 'rev_user_' + Date.now(),
          author: currentUser.fullname || currentUser.username,
          avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
          stars: rating,
          date: 'Vừa xong',
          variant: 'Khách hàng TechZone',
          comment: text,
          likes: 1,
          verified: true,
          isNew: true
        };

        saveReviewToStorage(newReview);
        commentInput.value = '';
        renderAllReviews();
        showToast('Cảm ơn bạn! Đánh giá đã được gửi thành công.', 'success', 'Gửi đánh giá');
      });
    }
  }

  renderAddReviewForm();
  renderAllReviews();
}

// --- 17. FLOATING SUPPORT WIDGET (CSKH & GỌI ĐIỆN NỔI GÓC DƯỚI BÊN TRÁI) ---
function initFloatingSupportWidget() {
  if (document.getElementById('tz-floating-support')) return;

  const widget = document.createElement('div');
  widget.id = 'tz-floating-support';
  widget.className = 'tz-floating-support';
  widget.innerHTML = `
    <!-- Nút Bấm Chính Hình Tròn với Hiệu Ứng Sóng Nước (Wave Pulse Ring) -->
    <button type="button" class="tz-support-trigger-btn" id="btn-toggle-support" title="Hỗ trợ trực tuyến & Hotline 24/7" aria-label="CSKH TechZone">
      <div class="support-wave-ring ring-1"></div>
      <div class="support-wave-ring ring-2"></div>
      <div class="support-icon-wrap">
        <i class="fa-solid fa-headset icon-headset"></i>
        <i class="fa-solid fa-xmark icon-close"></i>
      </div>
      <span class="support-tooltip-badge">Hỗ trợ 24/7</span>
    </button>

    <!-- Khung Hộp Thoại Chat CSKH TechZone (Kích thước chuẩn 360px x 500px) -->
    <div class="tz-support-chat-box cskh-chat-popup" id="tz-support-chat-box" aria-hidden="true">
      
      <!-- Chat Header -->
      <div class="tz-chat-header cskh-chat-header chat-header">
        <div class="tz-chat-agent-info">
          <div class="agent-avatar-wrap">
            <div class="brand-avatar-chip" title="TechZone CSKH">⚙️</div>
            <span class="agent-online-dot" title="Đang online trực tuyến"></span>
          </div>
          <div>
            <div class="agent-name">Hỗ trợ trực tuyến TechZone</div>
            <div class="agent-status"><span class="status-dot"></span> Sẵn sàng phản hồi trong 1 phút</div>
          </div>
        </div>
        <div class="tz-chat-header-actions">
          <a href="tel:18006868" class="tz-chat-call-btn" title="Gọi tổng đài miễn phí 1800.6868">
            <i class="fa-solid fa-phone"></i> 1800.6868
          </a>
          <button type="button" class="tz-chat-close-btn btn-cskh-close" id="btn-close-chat" title="Đóng / Thu nhỏ khung chat">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Quick Action Question Chips -->
      <div class="tz-chat-quick-chips">
        <button type="button" class="chat-chip-btn" data-question="Tra cứu đơn hàng">
          <i class="fa-solid fa-truck-fast"></i> Tra cứu đơn hàng
        </button>
        <button type="button" class="chat-chip-btn" data-question="Khuyến mãi hôm nay">
          <i class="fa-solid fa-bolt"></i> Khuyến mãi hôm nay
        </button>
        <button type="button" class="chat-chip-btn" data-question="Chính sách đổi trả">
          <i class="fa-solid fa-rotate-left"></i> Đổi trả 1-đổi-1
        </button>
        <button type="button" class="chat-chip-btn" data-question="Chi nhánh gần nhất">
          <i class="fa-solid fa-location-dot"></i> Chi nhánh gần nhất
        </button>
      </div>

      <!-- Messages Stream -->
      <div class="tz-chat-messages chat-body cskh-chat-body" id="tz-chat-messages">
        <!-- Message auto-welcome -->
        <div class="chat-msg msg-bot">
          <div class="brand-avatar-chip msg-avatar" title="TechZone CSKH">⚙️</div>
          <div class="msg-bubble">
            <div class="msg-text">
              Xin chào! TechZone có thể hỗ trợ gì cho bạn về sản phẩm, đơn hàng hay khuyến mãi hôm nay?
            </div>
            <div class="msg-time" id="welcome-msg-time">Vừa xong</div>
          </div>
        </div>
      </div>

      <!-- Typing Indicator (Ẩn hoàn toàn mặc định, chỉ hiện 1s khi gửi tin) -->
      <div class="tz-chat-typing" id="tz-chat-typing" style="display: none !important;">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-label">Chuyên viên đang soạn tin...</span>
      </div>

      <!-- Input Message Bar -->
      <form class="tz-chat-input-bar chat-footer cskh-chat-footer" id="tz-chat-form">
        <input type="text" id="input-chat-message" placeholder="Nhập câu hỏi cần hỗ trợ..." autocomplete="off" required>
        <button type="submit" class="btn-chat-send" title="Gửi tin nhắn">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(widget);

  const triggerBtn = widget.querySelector('#btn-toggle-support');
  const chatBox = widget.querySelector('#tz-support-chat-box');
  const closeBtn = widget.querySelector('#btn-close-chat');
  const chatForm = widget.querySelector('#tz-chat-form');
  const inputMessage = widget.querySelector('#input-chat-message');
  const messagesBox = widget.querySelector('#tz-chat-messages');
  const typingIndicator = widget.querySelector('#tz-chat-typing');
  const quickChips = widget.querySelectorAll('.chat-chip-btn');

  function toggleChat(forceOpen = null) {
    const isOpen = forceOpen !== null ? forceOpen : !chatBox.classList.contains('show');
    if (isOpen) {
      chatBox.classList.add('show');
      triggerBtn.classList.add('active');
      chatBox.setAttribute('aria-hidden', 'false');
      setTimeout(() => inputMessage?.focus(), 200);
    } else {
      chatBox.classList.remove('show');
      triggerBtn.classList.remove('active');
      chatBox.setAttribute('aria-hidden', 'true');
    }
  }

  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleChat();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleChat(false);
    });
  }

  document.addEventListener('click', (e) => {
    if (chatBox.classList.contains('show') && !widget.contains(e.target)) {
      toggleChat(false);
    }
  });

  const getCurrentTimeStr = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const welcomeTime = widget.querySelector('#welcome-msg-time');
  if (welcomeTime) welcomeTime.textContent = getCurrentTimeStr();

  function appendMessage(text, isUser = true) {
    const timeStr = getCurrentTimeStr();
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${isUser ? 'msg-user' : 'msg-bot'}`;
    if (isUser) {
      msgDiv.innerHTML = `
        <div class="msg-bubble">
          <div class="msg-text">${escapeHtml(text)}</div>
          <div class="msg-time">${timeStr}</div>
        </div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="brand-avatar-chip msg-avatar" title="TechZone CSKH">⚙️</div>
        <div class="msg-bubble">
          <div class="msg-text">${text}</div>
          <div class="msg-time">${timeStr}</div>
        </div>
      `;
    }
    messagesBox.appendChild(msgDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  function generateSmartResponse(query) {
    const q = query.toLowerCase();
    if (q.includes('đơn hàng') || q.includes('tra cứu') || q.includes('vận chuyển') || q.includes('spx') || q.includes('lộ trình')) {
      return `Bạn có thể bấm vào mục <strong><a href="history.html" style="color:#0284c7;text-decoration:underline;">Đơn mua</a></strong> ở thanh Header hoặc cung cấp mã đơn dạng <strong>SPX-XXXXXX</strong> để TechZone kiểm tra tọa độ bưu tá giao hàng ngay cho bạn nhé!`;
    }
    if (q.includes('khuyến mãi') || q.includes('giảm giá') || q.includes('voucher') || q.includes('sale')) {
      return `Hôm nay TechZone đang diễn ra phiên <strong>Flash Sale giảm đến 28%</strong> cho các dòng iPhone 16 Pro Max, Galaxy S24 Ultra, Asus ROG và tặng kèm voucher 50k cho thành viên Smember!`;
    }
    if (q.includes('đổi trả') || q.includes('bảo hành') || q.includes('lỗi')) {
      return `TechZone áp dụng chính sách <strong>1-đổi-1 miễn phí trong 30 ngày</strong> nếu máy phát sinh lỗi phần cứng, bảo hành 12 - 24 tháng chính hãng tại hơn 86 chi nhánh toàn quốc.`;
    }
    if (q.includes('cửa hàng') || q.includes('chi nhánh') || q.includes('địa chỉ')) {
      return `Hệ thống TechZone có hơn <strong>86 chi nhánh</strong> tại Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ, Hải Phòng... mở cửa từ 7h30 đến 22h00 hàng ngày. Hotline miễn phí: <strong>1800.6868</strong>.`;
    }
    if (q.includes('iphone') || q.includes('apple') || q.includes('samsung') || q.includes('laptop')) {
      return `Tất cả sản phẩm tại TechZone đều là hàng chính hãng <strong>nguyên seal 100%</strong> xuất xứ nhà phân phối chính thức, hỗ trợ trả góp 0% lãi suất và giao hàng hỏa tốc trong 2h!`;
    }
    return `Cảm ơn bạn đã nhắn tin! Chuyên viên tư vấn TechZone đang tiếp nhận thông tin và sẽ giải đáp chi tiết cho bạn ngay. Nếu cần hỗ trợ khẩn cấp, bạn có thể gọi hotline miễn cước: <strong>1800.6868</strong> nhé!`;
  }

  function handleUserSend(text) {
    if (!text || !text.trim()) return;
    appendMessage(text, true);

    if (typingIndicator) {
      typingIndicator.classList.add('show');
      typingIndicator.style.setProperty('display', 'flex', 'important');
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    setTimeout(() => {
      if (typingIndicator) {
        typingIndicator.classList.remove('show');
        typingIndicator.style.setProperty('display', 'none', 'important');
      }
      const reply = generateSmartResponse(text);
      appendMessage(reply, false);
    }, 1000);
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = inputMessage.value.trim();
      if (text) {
        handleUserSend(text);
        inputMessage.value = '';
      }
    });
  }

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.question;
      handleUserSend(q);
    });
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
