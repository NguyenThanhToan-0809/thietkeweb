/**
 * ==========================================================================
 * TECHZONE ECOSYSTEM - CORE JAVASCRIPT ENGINE (ES6)
 * Tech Catalog, Slider, Flash Sale Timer, LocalStorage, Cart & Tracking
 * ==========================================================================
 */

// --- 1. MOCK DATA: TECHZONE TECH CATALOG (20 SẢN PHẨM LƯU ẢNH CỤC BỘ images/spX.jpg) ---
const allProducts = [
  // 1. FLASH SALE 1: iPhone 16 Pro Max
  {
    id: 'sp1',
    name: 'iPhone 16 Pro Max 256GB - Titanium Tự Nhiên',
    category: 'phone',
    brand: 'Apple',
    originalPrice: 36990000,
    price: 34490000,
    oldPrice: 36990000,
    discountPercent: 7,
    isInstallment: true,
    soldCount: 88,
    totalStock: 100,
    isFlashSale: true,
    specs: ['6.9" Super Retina XDR', 'Chip Apple A18 Pro', 'Camera Control 48MP', 'Titanium Grade 5'],
    image: 'images/sp1.jpg',
    description: 'Flagship đỉnh cao từ Apple với phím điều khiển Camera Control, chip A18 Pro và viền màn hình siêu mỏng.'
  },
  // 2. FLASH SALE 2: Samsung Galaxy S24 Ultra
  {
    id: 'sp2',
    name: 'Samsung Galaxy S24 Ultra 12GB 256GB Titanium Gray',
    category: 'phone',
    brand: 'Samsung',
    originalPrice: 33990000,
    price: 27990000,
    oldPrice: 33990000,
    discountPercent: 18,
    isInstallment: true,
    soldCount: 92,
    totalStock: 100,
    isFlashSale: true,
    specs: ['Snapdragon 8 Gen 3 for Galaxy', 'RAM 12GB', 'Bút S-Pen tích hợp', 'Camera Zoom 100x'],
    image: 'images/sp2.jpg',
    description: 'Trí tuệ nhân tạo Galaxy AI đột phá, khung viền Titanium sang trọng, màn hình Dynamic AMOLED 2X sắc nét.'
  },
  // 3. FLASH SALE 3: Laptop Gaming ASUS ROG Strix G16
  {
    id: 'sp3',
    name: 'Laptop Gaming ASUS ROG Strix G16 i9 RTX 4080',
    category: 'laptop',
    brand: 'Asus',
    originalPrice: 56990000,
    price: 49990000,
    oldPrice: 56990000,
    discountPercent: 12,
    isInstallment: true,
    soldCount: 74,
    totalStock: 100,
    isFlashSale: true,
    specs: ['Core i9-14900HX', 'RTX 4080 12GB', 'RAM 32GB DDR5', 'Màn 2.5K 240Hz Nebula'],
    image: 'images/sp3.jpg',
    description: 'Quái thú gaming cấu hình cực đại, tản nhiệt kim loại lỏng Tri-Fan êm mát sẵn sàng chinh phục mọi tác vụ nặng.'
  },
  // 4. FLASH SALE 4: Tai nghe Apple AirPods Pro 2 Type-C
  {
    id: 'sp4',
    name: 'Tai nghe Bluetooth Apple AirPods Pro 2 2023 Type-C',
    category: 'audio',
    brand: 'Apple',
    originalPrice: 6190000,
    price: 5390000,
    oldPrice: 6190000,
    discountPercent: 13,
    isInstallment: true,
    soldCount: 97,
    totalStock: 100,
    isFlashSale: true,
    specs: ['Chip Apple H2', 'Cổng sạc Type-C', 'Chống ồn ANC 2x', 'Âm thanh vòm Spatial'],
    image: 'images/sp4.jpg',
    description: 'Khử ồn chủ động gấp đôi, chế độ xuyên âm thích ứng mượt mà và hộp sạc tích hợp loa tìm kiếm Find My.'
  },
  // 5. FLASH SALE 5: Apple Watch Ultra 2 49mm Titan
  {
    id: 'sp5',
    name: 'Đồng hồ Apple Watch Ultra 2 49mm Titan Dây Alpine',
    category: 'watch',
    brand: 'Apple',
    originalPrice: 25990000,
    price: 19490000,
    oldPrice: 25990000,
    discountPercent: 25,
    isInstallment: true,
    soldCount: 28,
    totalStock: 30,
    isFlashSale: true,
    specs: ['Vỏ Titan 49mm', 'Màn hình 3000 nits', 'Chống nước 100m', 'Thời lượng pin 72h'],
    image: 'images/sp5.jpg',
    description: 'Đỉnh cao đồng hồ thể thao chuyên nghiệp với độ sáng 3000 nits, định vị GPS tần số kép và độ bền chuẩn quân sự.'
  },
  // 6. Xiaomi 14 Ultra Leica
  {
    id: 'sp6',
    name: 'Xiaomi 14 Ultra 16GB 512GB Leica Summilux',
    category: 'phone',
    brand: 'Xiaomi',
    originalPrice: 32990000,
    price: 29990000,
    oldPrice: 32990000,
    discountPercent: 9,
    isInstallment: true,
    soldCount: 45,
    totalStock: 60,
    isFlashSale: false,
    specs: ['Cảm biến 1 inch LYT-900', 'Snapdragon 8 Gen 3', 'RAM 16GB', 'Sạc siêu nhanh 90W'],
    image: 'images/sp6.jpg',
    description: 'Nhiếp ảnh di động đỉnh cao với hệ thống 4 camera quang học Leica huyền thoại và màn hình WQHD+ AMOLED.'
  },
  // 7. MacBook Pro 14 M3 Pro
  {
    id: 'sp7',
    name: 'MacBook Pro 14 inch M3 Pro 18GB 512GB Space Black',
    category: 'laptop',
    brand: 'Apple',
    originalPrice: 49990000,
    price: 45490000,
    oldPrice: 49990000,
    discountPercent: 9,
    isInstallment: true,
    soldCount: 38,
    totalStock: 50,
    isFlashSale: false,
    specs: ['Chip Apple M3 Pro 11-Core', 'GPU 14-Core', 'RAM 18GB', 'Màn Liquid Retina XDR 120Hz'],
    image: 'images/sp7.jpg',
    description: 'Hiệu năng đồ họa đỉnh cao, màu sắc Space Black quyến rũ và thời lượng pin đột phá lên đến 18 tiếng.'
  },
  // 8. Sony WH-1000XM5
  {
    id: 'sp8',
    name: 'Tai nghe Chống ồn Sony WH-1000XM5 Hi-Res Audio',
    category: 'audio',
    brand: 'Sony',
    originalPrice: 8990000,
    price: 6990000,
    oldPrice: 8990000,
    discountPercent: 22,
    isInstallment: true,
    soldCount: 65,
    totalStock: 80,
    isFlashSale: false,
    specs: ['2 vi xử lý V1 & QN1', '8 micro chống ồn', 'Driver 30mm sợi Carbon', 'Pin 30 giờ sạc nhanh'],
    image: 'images/sp8.jpg',
    description: 'Chuẩn mực tai nghe chống ồn hàng đầu thế giới với chất âm Hi-Res sắc sảo và đệm tai da êm ái.'
  },
  // 9. Garmin Forerunner 265
  {
    id: 'sp9',
    name: 'Đồng hồ thông minh Garmin Forerunner 265 GPS',
    category: 'watch',
    brand: 'Garmin',
    originalPrice: 11990000,
    price: 9990000,
    oldPrice: 11990000,
    discountPercent: 17,
    isInstallment: true,
    soldCount: 52,
    totalStock: 70,
    isFlashSale: false,
    specs: ['Màn AMOLED cảm ứng', 'GPS đa băng tần', 'Đo HRV & Sẵn sàng tập', 'Pin 13 ngày'],
    image: 'images/sp9.jpg',
    description: 'Đồng hồ thể thao chuyên biệt cho chạy bộ với màn hình AMOLED rực rỡ và giáo án tập luyện chuẩn Garmin Coach.'
  },
  // 10. Keychron K2 Pro Custom Keyboard
  {
    id: 'sp10',
    name: 'Bàn phím cơ không dây Keychron K2 Pro QMK/VIA',
    category: 'accessory',
    brand: 'Keychron',
    originalPrice: 2890000,
    price: 2390000,
    oldPrice: 2890000,
    discountPercent: 17,
    isInstallment: true,
    soldCount: 84,
    totalStock: 100,
    isFlashSale: false,
    specs: ['Hot-swap switch', 'Keycap PBT Double-shot', 'Kết nối Bluetooth 5.1/Dây', 'Đèn LED RGB'],
    image: 'images/sp10.jpg',
    description: 'Bàn phím cơ layout 75% kinh điển, hỗ trợ lập trình layout phím QMK/VIA và tương thích hoàn hảo Mac/Windows.'
  },
  // 11. Chuột Logitech G Pro X Superlight
  {
    id: 'sp11',
    name: 'Chuột Gaming không dây Logitech G Pro X Superlight',
    category: 'accessory',
    brand: 'Logitech',
    originalPrice: 3490000,
    price: 2690000,
    oldPrice: 3490000,
    discountPercent: 23,
    isInstallment: true,
    soldCount: 112,
    totalStock: 150,
    isFlashSale: false,
    specs: ['Trọng lượng siêu nhẹ <63g', 'Cảm biến HERO 25K', 'Không dây Lightspeed', 'Feet chuột PTFE lớn'],
    image: 'images/sp11.jpg',
    description: 'Vũ khí vô địch của các game thủ eSports hàng đầu với độ trễ 1ms và trọng lượng siêu nhẹ.'
  },
  // 12. Củ sạc nhanh GaN Anker 65W
  {
    id: 'sp12',
    name: 'Củ sạc nhanh GaN Anker 735 65W 3 Cổng Type-C',
    category: 'accessory',
    brand: 'Anker',
    originalPrice: 1290000,
    price: 890000,
    oldPrice: 1290000,
    discountPercent: 31,
    isInstallment: true,
    soldCount: 150,
    totalStock: 200,
    isFlashSale: false,
    specs: ['Công nghệ GaNPrime', 'Công suất 65W', '2 Cổng Type-C + 1 USB-A', 'Bảo vệ ActiveShield'],
    image: 'images/sp12.jpg',
    description: 'Củ sạc nhỏ gọn sạc cùng lúc 3 thiết bị MacBook, iPhone, Apple Watch với công nghệ PowerIQ 4.0.'
  },
  // 13. iPad Air M2 11 inch
  {
    id: 'sp13',
    name: 'iPad Air M2 11 inch 128GB Wifi Chính Hãng Apple',
    category: 'phone',
    brand: 'Apple',
    originalPrice: 16990000,
    price: 14990000,
    oldPrice: 16990000,
    discountPercent: 12,
    isInstallment: true,
    soldCount: 42,
    totalStock: 60,
    isFlashSale: false,
    specs: ['Chip Apple M2', 'Màn Liquid Retina 11"', 'Hỗ trợ Apple Pencil Pro', 'Camera trước ngang 12MP'],
    image: 'images/sp13.jpg',
    description: 'Sức mạnh chip M2 bứt phá, thiết kế nhôm nguyên khối siêu mỏng và hỗ trợ bút Apple Pencil Pro mới nhất.'
  },
  // 14. Dell XPS 15 9530
  {
    id: 'sp14',
    name: 'Laptop Dell XPS 15 9530 Core i7 RTX 4050 OLED',
    category: 'laptop',
    brand: 'Dell',
    originalPrice: 54990000,
    price: 48990000,
    oldPrice: 54990000,
    discountPercent: 11,
    isInstallment: true,
    soldCount: 25,
    totalStock: 40,
    isFlashSale: false,
    specs: ['Core i7-13700H', 'RTX 4050 6GB', 'RAM 16GB DDR5', 'Màn 3.5K OLED Touch'],
    image: 'images/sp14.jpg',
    description: 'Kiệt tác laptop mỏng nhẹ doanh nhân với khung viền nhôm CNC, chiếu nghỉ tay sợi carbon và màn hình OLED cảm ứng tuyệt đẹp.'
  },
  // 15. Marshall Emberton II
  {
    id: 'sp15',
    name: 'Loa Bluetooth di động Marshall Emberton II 20W',
    category: 'audio',
    brand: 'Marshall',
    originalPrice: 4990000,
    price: 3890000,
    oldPrice: 4990000,
    discountPercent: 22,
    isInstallment: true,
    soldCount: 68,
    totalStock: 80,
    isFlashSale: false,
    specs: ['Âm thanh đa hướng 360 độ', 'Chống nước bụi IP67', 'Pin 30 giờ nghe liên tục', 'Chế độ Stack Mode'],
    image: 'images/sp15.jpg',
    description: 'Biểu tượng âm thanh cổ điển phong cách rock n roll với thời lượng pin 30 giờ và khả năng chống nước IP67 bền bỉ.'
  },
  // 16. Pin sạc dự phòng Baseus Blade 100W
  {
    id: 'sp16',
    name: 'Pin sạc dự phòng Baseus Blade 100W 20.000mAh',
    category: 'accessory',
    brand: 'Baseus',
    originalPrice: 1690000,
    price: 1190000,
    oldPrice: 1690000,
    discountPercent: 30,
    isInstallment: true,
    soldCount: 95,
    totalStock: 120,
    isFlashSale: false,
    specs: ['Công suất khủng 100W', 'Dung lượng 20.000mAh', 'Thiết kế dẹt 18mm siêu mỏng', 'Màn hình LED kỹ thuật số'],
    image: 'images/sp16.jpg',
    description: 'Pin dự phòng siêu mỏng sạc được cho cả MacBook Pro và laptop gaming với màn hình hiển thị công suất thời gian thực.'
  },
  // 17. SSD Samsung 990 Pro 1TB
  {
    id: 'sp17',
    name: 'Ổ cứng SSD Samsung 990 Pro 1TB NVMe PCIe Gen 4',
    category: 'accessory',
    brand: 'Samsung',
    originalPrice: 3290000,
    price: 2590000,
    oldPrice: 3290000,
    discountPercent: 21,
    isInstallment: true,
    soldCount: 78,
    totalStock: 100,
    isFlashSale: false,
    specs: ['Tốc độ đọc 7450 MB/s', 'Tốc độ ghi 6900 MB/s', 'Bộ nhớ V-NAND TLC', 'Hỗ trợ PS5 & PC'],
    image: 'images/sp17.jpg',
    description: 'Ổ cứng SSD NVMe nhanh nhất thế giới cho tốc độ tải game thần tốc và xử lý đồ họa chuyên sâu 8K.'
  },
  // 18. Samsung Galaxy Z Fold6
  {
    id: 'sp18',
    name: 'Samsung Galaxy Z Fold6 5G 12GB 256GB Silver',
    category: 'phone',
    brand: 'Samsung',
    originalPrice: 43990000,
    price: 37990000,
    oldPrice: 43990000,
    discountPercent: 14,
    isInstallment: true,
    soldCount: 30,
    totalStock: 50,
    isFlashSale: false,
    specs: ['Màn chính 7.6" Dynamic AMOLED 2X', 'Bản lề Flex gập phẳng', 'Snapdragon 8 Gen 3', 'Galaxy AI thế hệ mới'],
    image: 'images/sp18.jpg',
    description: 'Tuyệt tác smartphone màn hình gập thế hệ mới, mỏng nhẹ hơn, trang bị Galaxy AI thông minh và độ bền chuẩn IP48.'
  },
  // 19. Màn hình gaming ASUS TUF 27
  {
    id: 'sp19',
    name: 'Màn hình gaming ASUS TUF VG27AQ3A 27" 2K 180Hz',
    category: 'laptop',
    brand: 'Asus',
    originalPrice: 6990000,
    price: 5490000,
    oldPrice: 6990000,
    discountPercent: 21,
    isInstallment: true,
    soldCount: 56,
    totalStock: 75,
    isFlashSale: false,
    specs: ['Độ phân giải 2K QHD', 'Fast IPS 180Hz', 'Thời gian phản hồi 1ms GTG', '130% sRGB & HDR10'],
    image: 'images/sp19.jpg',
    description: 'Màn hình gaming chuẩn thi đấu eSports cho hình ảnh sắc nét, màu sắc chuẩn đồ họa và không hề xé hình với G-Sync.'
  },
  // 20. Galaxy Watch 6 Classic
  {
    id: 'sp20',
    name: 'Đồng hồ Samsung Galaxy Watch 6 Classic 43mm LTE',
    category: 'watch',
    brand: 'Samsung',
    originalPrice: 8990000,
    price: 6490000,
    oldPrice: 8990000,
    discountPercent: 28,
    isInstallment: true,
    soldCount: 48,
    totalStock: 65,
    isFlashSale: false,
    specs: ['Viền xoay bezel vật lý cổ điển', 'Kính Sapphire chống trầy', 'Đo huyết áp & ECG', 'Hỗ trợ eSIM nghe gọi'],
    image: 'images/sp20.jpg',
    description: 'Sự trở lại của viền bezel xoay trứ danh kết hợp kính sapphire cao cấp và tính năng theo dõi giấc ngủ chuyên sâu.'
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

      <div class="product-img tz-card-thumb">
        <img src="${prod.image}" alt="${prod.name}" loading="lazy">
      </div>

      <h4 class="product-title tz-product-title" title="${prod.name}">${prod.name}</h4>

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
          <div class="smart-banner-thumb-wrap">
            <img src="${itemImg}" alt="${itemName}" class="smart-banner-thumb">
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
  const userAddresses = Auth.getUserAddresses(currentUser);
  const defaultAddr = Auth.getDefaultAddress(currentUser);

  function applyAddressToCheckoutForm(addr) {
    if (!addr) return;
    if (custNameInput) custNameInput.value = addr.recipientName || '';
    if (custPhoneInput) custPhoneInput.value = addr.phone || '';
    if (custCityInput && addr.city) custCityInput.value = addr.city;
    if (custAddressInput) custAddressInput.value = addr.detailAddress || '';

    const activeSummary = document.getElementById('active-address-summary');
    if (activeSummary) {
      const isDef = addr.isDefault === true || addr.isDefault === 'true';
      activeSummary.innerHTML = `
        <div class="active-addr-card">
          <div class="active-addr-top-row">
            <div class="active-addr-user-meta">
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

    // Bind chọn địa chỉ
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

    // Bind đặt làm mặc định
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
    if (addFormBox) addFormBox.style.display = 'none';
    if (toggleAddFormBtn) toggleAddFormBtn.style.display = 'flex';
    if (addrModal) addrModal.classList.add('show');
  }

  function closeAddressBookModal() {
    if (addrModal) addrModal.classList.remove('show');
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
      addFormBox.style.display = 'block';
      toggleAddFormBtn.style.display = 'none';
      const nameInp = document.getElementById('new-addr-name');
      if (nameInp) nameInp.focus();
    };
  }

  if (cancelAddBtn && addFormBox) {
    cancelAddBtn.onclick = () => {
      addFormBox.style.display = 'none';
      if (toggleAddFormBtn) toggleAddFormBtn.style.display = 'flex';
    };
  }

  if (saveNewAddrBtn) {
    saveNewAddrBtn.onclick = () => {
      const nameVal = document.getElementById('new-addr-name')?.value.trim();
      const phoneVal = document.getElementById('new-addr-phone')?.value.trim();
      const cityVal = document.getElementById('new-addr-city')?.value || 'Hà Nội';
      const detailVal = document.getElementById('new-addr-detail')?.value.trim();
      const isDefVal = document.getElementById('new-addr-default')?.checked;

      if (!nameVal || !phoneVal || !detailVal) {
        showToast('Vui lòng điền đầy đủ họ tên, SĐT và địa chỉ chi tiết!', 'warning');
        return;
      }

      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})/;
      if (!phoneRegex.test(phoneVal)) {
        showToast('Số điện thoại nhận hàng không hợp lệ!', 'error');
        return;
      }

      const newAddr = Auth.addAddress({
        recipientName: nameVal,
        phone: phoneVal,
        city: cityVal,
        detailAddress: detailVal
      }, isDefVal);

      showToast('Đã lưu địa chỉ nhận hàng mới vĩnh viễn vào tài khoản!', 'success');
      applyAddressToCheckoutForm(newAddr);

      // Reset form
      document.getElementById('new-addr-name').value = '';
      document.getElementById('new-addr-phone').value = '';
      document.getElementById('new-addr-detail').value = '';
      document.getElementById('new-addr-default').checked = false;

      addFormBox.style.display = 'none';
      if (toggleAddFormBtn) toggleAddFormBtn.style.display = 'flex';

      renderAddressBookList();
    };
  }

  let currentDiscount = 0;

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
          <span class="tz-qty-num">${item.quantity}</span>
          <button type="button" class="tz-qty-btn btn-plus" data-id="${item.id}">+</button>
        </div>
        <button type="button" class="tz-cart-remove-btn" data-id="${item.id}" title="Xóa món">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `).join('');

    calculateTotals(cart);
    bindCartEvents();
  }

  function calculateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const shippingRadio = document.querySelector('input[name="shipping_service"]:checked');
    const isExpress = shippingRadio ? shippingRadio.value === 'express' : true;

    let shippingFee = isExpress ? 35000 : 25000;
    if (subtotal >= 2000000) {
      shippingFee = 0; // Free ship for orders >= 2M
    }

    const finalTotal = Math.max(0, subtotal + shippingFee - currentDiscount);

    if (subtotalElem) subtotalElem.textContent = formatVND(subtotal);
    if (shippingElem) {
      shippingElem.textContent = shippingFee === 0 ? 'Miễn phí (Đơn > 2tr)' : formatVND(shippingFee);
      shippingElem.style.color = shippingFee === 0 ? '#10b981' : '';
    }
    if (discountElem) {
      discountElem.textContent = currentDiscount > 0 ? `-${formatVND(currentDiscount)}` : '0 đ';
      discountElem.style.color = currentDiscount > 0 ? '#0284c7' : '';
    }
    if (totalElem) totalElem.textContent = formatVND(finalTotal);

    return { subtotal, shippingFee, discount: currentDiscount, finalTotal };
  }

  function bindCartEvents() {
    const minusBtns = cartListWrap.querySelectorAll('.btn-minus');
    const plusBtns = cartListWrap.querySelectorAll('.btn-plus');
    const removeBtns = cartListWrap.querySelectorAll('.tz-cart-remove-btn');

    minusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        Storage.updateQuantity(btn.dataset.id, -1);
        renderCartList();
      });
    });

    plusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        Storage.updateQuantity(btn.dataset.id, 1);
        renderCartList();
      });
    });

    removeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        Storage.removeFromCart(btn.dataset.id);
        showToast('Đã xóa thiết bị khỏi giỏ hàng', 'info');
        renderCartList();
      });
    });
  }

  // Voucher apply
  if (voucherForm && voucherInput) {
    voucherForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = voucherInput.value.trim().toUpperCase();
      if (code === 'TECHZONE50' || code === 'TZ50K') {
        currentDiscount = 50000;
        showToast('Áp dụng thành công mã giảm giá 50.000đ từ TechZone!', 'success');
      } else if (code === 'FREESHIP') {
        currentDiscount = 35000;
        showToast('Áp dụng mã miễn phí giao hàng hỏa tốc thành công!', 'success');
      } else {
        showToast('Mã voucher không hợp lệ. Vui lòng thử mã: TECHZONE50', 'error');
      }
      renderCartList();
    });
  }

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
        checkpoints: [
          { time: 'Vừa xong', text: 'Đơn hàng đã được khởi tạo thành công trên hệ thống TechZone Official Store.' },
          { time: 'Chờ xác nhận', text: 'Người bán TechZone đang chuẩn bị bưu kiện và in mã vận đơn Shopee Express.' }
        ]
      };

      Storage.addOrder(newOrder);
      Storage.clearCart();

      showToast(`Tạo đơn hàng <strong>${randomId}</strong> thành công! Đang chuyển hướng sang tra cứu...`, 'success');

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

// --- 9. PAGE LOGIC: ORDER HISTORY (history.html) - CHUẨN GIAO DIỆN SHOPEE ---
function initHistoryPage() {
  const container = document.getElementById('history-cards-container');
  const tabs = document.querySelectorAll('.shopee-tab-item');
  const searchInput = document.getElementById('shopee-search-input');

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

  let currentFilter = 'all';
  let searchQuery = '';

  function renderHistory() {
    const allOrders = Storage.getOrders();
    const cEmail = (currentUser.email || '').toLowerCase().trim();

    // 2. CHỈ lọc những đơn hàng thuộc về chính tài khoản này (order.userEmail === currentUser.email)
    let userOrders = allOrders.filter(o => {
      const oEmail = (o.userEmail || o.customer?.email || '').toLowerCase().trim();
      if (cEmail && oEmail && cEmail === oEmail) return true;
      if (currentUser.username === 'admin' && (o.customer?.name === 'Quản trị viên TechZone' || o.id === 'SPX-892341' || !o.userEmail || o.userEmail === 'admin@gmail.com')) {
        return true;
      }
      return false;
    });

    // 3. Nếu tài khoản chưa có đơn hàng nào (tài khoản mới): Hiển thị trạng thái rỗng chuẩn Shopee
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

    // Filter by Tab Status
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

    // Filter by Search Query
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

      // Kiểm tra trạng thái Đã hủy để render khung tóm tắt & nút riêng biệt
      const isCancelled = o.status === 'Đã hủy';
      const latestCheckpoint = (o.checkpoints && o.checkpoints.length > 0) ? o.checkpoints[0] : null;

      let notificationText = o.shippingNotification;
      if (!notificationText || o.status === 'Đã giao' || o.status === 'Giao thành công') {
        if (o.status === 'Đang giao' || o.status === 'Đang vận chuyển') {
          notificationText = '🚚 Đang giao hàng đến bạn';
        } else if (o.status === 'Đã giao' || o.status === 'Giao thành công') {
          const dateStr = o.deliveredDate || (latestCheckpoint ? latestCheckpoint.time : o.createdAt);
          notificationText = `Giao thành công • ${dateStr}`;
        } else {
          notificationText = '📦 Đang chuẩn bị tại kho';
        }
      }

      return `
        <div class="shopee-order-card" data-order-id="${o.id}">
          <!-- Header: Shop & Code & Status -->
          <div class="shopee-card-header">
            <div class="shopee-shop-info">
              <span class="shopee-badge-mall">Shopee Mall</span>
              <span class="shopee-shop-name"><i class="fa-solid fa-store" style="color: #ee4d2d; margin-right: 4px;"></i> TechZone Official Store</span>
              <button type="button" class="shopee-btn-chat" onclick="event.stopPropagation(); showToast('Đang kết nối trung tâm Chat Shopee với người bán TechZone...', 'info')">
                <i class="fa-regular fa-comment-dots"></i> Chat
              </button>
              <a href="products.html" class="shopee-btn-viewshop" onclick="event.stopPropagation()">
                <i class="fa-solid fa-shop"></i> Xem Shop
              </a>
              <span class="shopee-order-meta">
                Mã ĐH: <strong>#${o.id}</strong> <span style="font-size: 0.78rem; color: #94a3b8;">(${o.createdAt})</span>
              </span>
            </div>
            <div class="shopee-order-status-badge ${statusClass}">
              <i class="${statusIcon}"></i> ${statusLabel}
            </div>
          </div>

          <!-- Body: Items List (CLICK ĐỂ XEM TIẾN TRÌNH) -->
          <div class="shopee-order-body" data-order-id="${o.id}" title="Nhấp vào để xem ngay chi tiết lộ trình vận chuyển">
            ${itemsHtml}
          </div>

          <!-- Dòng tóm tắt tiến trình vận chuyển (Phân nhánh cho Đơn đã hủy vs Đơn thường) -->
          <div class="shopee-shipping-wrap">
            ${isCancelled ? `
              <div class="shopee-shipping-strip cancelled" data-order-id="${o.id}" title="Đơn hàng đã được hủy bỏ">
                <i class="fa-solid fa-ban"></i>
                <div class="strip-text-box">
                  <div class="strip-main-text">
                    🚫 ${o.cancelReason ? `Đơn hàng đã được hủy bởi người mua (Lý do: ${o.cancelReason})` : 'Đơn hàng đã hủy thành công'}
                  </div>
                  ${o.cancelDate ? `<div class="strip-sub-text"><i class="fa-regular fa-clock"></i> Thời gian hủy: ${o.cancelDate}</div>` : ''}
                </div>
                <div class="strip-view-link">
                  <span>Chi tiết đơn</span>
                  <i class="fa-solid fa-chevron-right"></i>
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

          <!-- Footer: Total & Action Buttons -->
          <div class="shopee-card-footer">
            <div class="shopee-footer-action-row">
              <div class="shopee-total-wrap">
                <i class="fa-solid fa-shield-halved shopee-shield-icon" style="color: #10b981;" title="TechZone bảo hiểm người mua"></i>
                <span class="shopee-total-label">Thành tiền (${totalItemsCount} sản phẩm):</span>
                <span class="shopee-total-price">${formatVND(o.total)}</span>
              </div>

              <div class="shopee-btn-group ${isCancelled ? 'has-2-btns' : 'has-3-btns'}">
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
                  ` : (o.status === 'Đang giao' || o.status === 'Đang vận chuyển' || o.status === 'Đã giao' || o.status === 'Giao thành công') ? `
                    <button type="button" class="btn-shopee-cancel disabled" data-disabled-cancel="true" data-id="${o.id}" title="Đơn hàng đã được bàn giao cho tài xế, không thể hủy. Vui lòng liên hệ Hotline 1800.6868 nếu cần hỗ trợ.">
                      <i class="fa-solid fa-lock"></i> <span>Không thể hủy</span>
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

    // Bind Click-to-view events (BẤM VÀO BẤT KỲ ĐÂU TRÊN THẺ SẢN PHẨM HOẶC DẢI VẬN CHUYỂN ĐỂ XEM)
    container.querySelectorAll('.shopee-order-body, .shopee-shipping-strip').forEach(el => {
      el.addEventListener('click', (e) => {
        const orderId = el.dataset.orderId || el.closest('.shopee-order-card')?.dataset.orderId;
        if (orderId) {
          window.location.href = `tracking-detail.html?id=${encodeURIComponent(orderId)}`;
        }
      });
    });

    // Bind Reorder buttons (Mua lại trên đơn đã hủy)
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

    // Bind Cancel Order buttons in History Cards
    container.querySelectorAll('.btn-open-cancel-order').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = btn.dataset.id;
        openCancelOrderModal(orderId, () => {
          // Chuyển tab sang 'Đã hủy' và re-render
          currentFilter = 'Đã hủy';
          tabs.forEach(t => {
            if (t.dataset.status === 'Đã hủy') t.classList.add('active');
            else t.classList.remove('active');
          });
          renderHistory();
        });
      });
    });

    container.querySelectorAll('.btn-shopee-cancel.disabled').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('Đơn hàng đã được bàn giao cho tài xế, không thể hủy. Vui lòng liên hệ Hotline 1800.6868 nếu cần hỗ trợ.', 'warning');
      });
    });
  }

  // Bind Shopee Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.status || 'all';
      renderHistory();
    });
  });

  // Bind Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderHistory();
    });
  }



  renderHistory();
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

          <!-- Shipper info if shipping -->
          ${order.shipper && order.status !== 'Đã hủy' ? `
            <div style="margin-top: 1.5rem; padding: 12px 14px; background: #fffbf8; border: 1px solid #fed7aa; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
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

// --- 10. LOCATION SELECTOR (CUSTOM DROPDOWN - NO PROMPT) ---
function initLocationSelector() {
  const CITIES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Đồng Nai'];
  const STORAGE_KEY = 'selectedLocation';

  // Read saved location or default to 'Hà Nội'
  let savedCity = localStorage.getItem(STORAGE_KEY);
  if (!savedCity || !CITIES.includes(savedCity)) {
    savedCity = 'Hà Nội';
    localStorage.setItem(STORAGE_KEY, savedCity);
  }

  function updateLocationDisplay(city) {
    document.querySelectorAll('.tz-location-name').forEach(el => {
      el.textContent = city;
    });

    document.querySelectorAll('.tz-location-item').forEach(item => {
      const itemCity = item.getAttribute('data-city') || item.dataset.city || item.textContent.trim();
      if (itemCity === city || itemCity.includes(city) || city.includes(itemCity)) {
        item.classList.add('active');
        item.setAttribute('aria-selected', 'true');
      } else {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
      }
    });
  }

  // Khởi tạo hiển thị lần đầu theo localStorage
  updateLocationDisplay(savedCity);

  function closeAllLocationDropdowns() {
    document.querySelectorAll('.tz-location-dropdown, .location-dropdown, .location-menu').forEach(dd => {
      dd.classList.remove('show');
    });
    document.querySelectorAll('.tz-location-badge').forEach(btn => {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
    const backdrop = document.getElementById('tz-location-backdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
      backdrop.style.display = 'none';
    }
  }

  function showMobileBackdrop() {
    // Chỉ kích hoạt backdrop trên màn hình nhỏ (<= 540px) dạng bottom sheet
    if (window.innerWidth <= 540) {
      let backdrop = document.getElementById('tz-location-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'tz-location-backdrop';
        backdrop.className = 'tz-location-backdrop';
        document.body.appendChild(backdrop);
        backdrop.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeAllLocationDropdowns();
        });
      }
      backdrop.style.display = 'block';
      backdrop.classList.add('active');
    }
  }

  // Event Delegation gắn trực tiếp vào document.addEventListener('click', ...)
  document.addEventListener('click', function(e) {
    // 1. CLICK CHỌN ITEM TỈNH/THÀNH:
    const item = e.target.closest('.tz-location-item');
    if (item) {
      e.preventDefault();
      e.stopPropagation();

      // + Lấy đúng tên tỉnh/thành vừa chọn
      let city = item.getAttribute('data-city') || item.dataset.city;
      if (!city) {
        const text = (item.innerText || item.textContent || '').trim();
        for (const c of CITIES) {
          if (text.includes(c)) {
            city = c;
            break;
          }
        }
      }

      if (city) {
        // + Lưu vào localStorage
        localStorage.setItem(STORAGE_KEY, city);
        savedCity = city;

        // + Đổi text hiển thị của nút vị trí trên Topbar
        updateLocationDisplay(city);

        // + Tự động đóng menu lại ngay lập tức
        closeAllLocationDropdowns();

        // Hiển thị thông báo Toast nếu có
        if (typeof showToast === 'function') {
          showToast(`Đã chuyển khu vực mua sắm sang: <strong>${city}</strong>`, 'success');
        }
      }
      return;
    }

    // 2. CLICK NÚT MỞ/ĐÓNG MENU VỊ TRÍ TRÊN TOPBAR:
    const badgeBtn = e.target.closest('.tz-location-badge, #btn-select-location');
    if (badgeBtn) {
      e.preventDefault();
      e.stopPropagation();

      const wrapper = badgeBtn.closest('.tz-location-wrapper') || badgeBtn.parentElement;
      const dropdown = wrapper ? wrapper.querySelector('.tz-location-dropdown, .location-dropdown, .location-menu') : document.querySelector('.tz-location-dropdown');
      if (!dropdown) return;

      const isOpen = dropdown.classList.contains('show');
      closeAllLocationDropdowns();

      if (!isOpen) {
        dropdown.classList.add('show');
        badgeBtn.classList.add('open');
        badgeBtn.setAttribute('aria-expanded', 'true');
        showMobileBackdrop();
      }
      return;
    }

    // 3. CLICK RA NGOÀI KHUNG THÌ TỰ ĐỘNG ĐÓNG MENU
    if (!e.target.closest('.tz-location-wrapper') && !e.target.closest('.tz-location-dropdown') && !e.target.closest('.location-menu') && !e.target.closest('.location-dropdown')) {
      closeAllLocationDropdowns();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllLocationDropdowns();
      if (typeof closeLogoutModal === 'function') closeLogoutModal();
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
  const pathname = window.location.pathname.toLowerCase();
  if (pathname.includes('checkout') || pathname.includes('history') || pathname.includes('profile')) {
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
  const modals = document.querySelectorAll('#tz-google-modal, #tz-facebook-modal, #tz-zalo-modal, #tz-apple-modal');
  modals.forEach(m => m.classList.remove('show'));
}

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
  modal.classList.add('show');
}

function closeGoogleModal() {
  closeAllSocialModals();
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
  const userBtn = document.getElementById('tz-user-btn');
  const userDropdown = document.getElementById('tz-user-dropdown');
  const nameDisplay = document.getElementById('tz-user-name-display');
  const greetingDisplay = document.getElementById('tz-dropdown-greeting');
  const logoutBtn = document.getElementById('tz-btn-logout');
  const profileBtn = document.getElementById('tz-btn-profile-info');

  // Lấy currentUser từ localStorage
  const currentUser = Auth.getUser();

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
      userBtn.setAttribute('href', '#');
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
      if (userDropdown && !e.target.closest('#tz-user-wrapper')) {
        userDropdown.classList.remove('show');
      }
    });

    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (userDropdown) {
          userDropdown.classList.remove('show');
        }
        openLogoutModal();
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

  // 3. Tính toán đơn hàng và điểm tích lũy THỰC TẾ của người dùng này (KHÔNG ĐƯỢC HARDCODE)
  const allOrders = Storage.getOrders();
  const cEmail = (currentUser.email || '').toLowerCase().trim();
  const cPhone = (currentUser.phone || '').replace(/\D/g, '');
  const cName = (currentUser.fullname || '').toLowerCase().trim();

  const userOrders = allOrders.filter(o => {
    const oEmail = (o.userEmail || o.customer?.email || '').toLowerCase().trim();
    const oPhone = (o.customer?.phone || '').replace(/\D/g, '');
    const oName = (o.customer?.name || '').toLowerCase().trim();

    if (cEmail && oEmail && cEmail === oEmail) return true;
    if (cPhone && oPhone && cPhone === oPhone) return true;
    if (cName && oName && cName === oName) return true;
    // Tài khoản admin mẫu được xem các đơn mock của TechZone
    if (currentUser.username === 'admin' && (o.customer?.name === 'Quản trị viên TechZone' || o.id === 'SPX-892341')) return true;
    return false;
  });

  const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const rewardPoints = (currentUser.points !== undefined && currentUser.points !== null) ? Number(currentUser.points) : Math.floor(totalSpent / 10000);

  // Phân hạng Smember dựa trên tổng chi tiêu thực tế:
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

  const pointsEl = document.getElementById('profile-reward-points');
  const spentEl = document.getElementById('profile-total-spent');
  const ordersCountEl = document.getElementById('profile-orders-count');

  if (userRankBadge) userRankBadge.innerHTML = `${rankIconHtml} ${rankText}`;
  if (pointsEl) pointsEl.innerHTML = `${rewardPoints.toLocaleString('vi-VN')} <span class="unit">điểm</span>`;
  if (spentEl) spentEl.innerHTML = `${totalSpent.toLocaleString('vi-VN')} <span class="unit">đ</span>`;
  if (ordersCountEl) ordersCountEl.innerHTML = `${userOrders.length} <span class="unit">đơn hàng</span>`;

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
  Storage.updateCartBadge();
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

  if (pathname.includes('login') || document.getElementById('tz-login-form')) {
    initLoginPage();
  } else if (pathname.includes('complete-profile') || document.getElementById('tz-complete-profile-form')) {
    initCompleteProfilePage();
  } else if (pathname.includes('register') || document.getElementById('tz-register-form')) {
    initRegisterPage();
  } else if (pathname.includes('profile') || document.getElementById('tz-profile-form')) {
    initProfilePage();
  } else if (pathname.includes('products') || document.getElementById('catalog-products-grid')) {
    initProductsPage();
  } else if (pathname.includes('checkout') || document.getElementById('tz-checkout-form')) {
    initCheckoutPage();
  } else if (pathname.includes('tracking') || document.querySelector('.order-timeline')) {
    initTrackingDetailPage();
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

  if (typeof callback === 'function') {
    callback(order);
  }
}
