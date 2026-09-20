export type LangCode = 'en' | 'fa' | 'ps'

type Dictionary = Record<string, string>

const fa: Dictionary = {
  'Home': 'خانه',
  'Products': 'محصولات',
  'Services': 'خدمات',
  'News': 'اخبار',
  'About': 'درباره ما',
  'Contact': 'تماس',
  'Contact us': 'تماس با ما',
  'Companies': 'شرکت‌ها',
  'Navigation': 'راهنمای سایت',
  'Get in touch': 'با ما در تماس شوید',
  'All rights reserved.': 'تمام حقوق محفوظ است.',
  'Professional education, travel, technology and media services from one trusted Afghan group.': 'خدمات حرفه‌ای آموزشی، سیاحتی، تکنالوژی و رسانه از یک مجموعه معتبر افغانی.',
  'Explore Services': 'مشاهده خدمات',
  'Discover Afghan Power': 'آشنایی با افغان پاور',
  'Core Divisions': 'بخش‌های اصلی',
  'Unified Group': 'مجموعه یکپارچه',
  'Business Solutions': 'راهکارهای تجارتی',
  'Explore': 'مشاهده',
  'WHAT WE DO': 'خدمات ما',
  'One group.': 'یک مجموعه.',
  'Many possibilities.': 'فرصت‌های بی‌شمار.',
  'From study and travel to technology and media, Afghan Power Group brings practical services together under one trusted brand.': 'از تحصیل و سفر تا تکنالوژی و رسانه، افغان پاور گروپ خدمات کاربردی را زیر یک برند معتبر گردهم آورده است.',
  'ONE GROUP · MULTIPLE SOLUTIONS': 'یک مجموعه · راهکارهای متعدد',
  'AFGHAN POWER GROUP': 'افغان پاور گروپ',
  'EDUCATIONAL CONSULTANCY': 'مشاوره تحصیلی',
  'TRAVEL AGENCY': 'آژانس سیاحتی',
  'TECH DEVELOPMENT': 'توسعه تکنالوژی',
  'MEDIA PRODUCTION': 'تولیدات رسانه‌ای',
  'Educational Consultancy': 'مشاوره تحصیلی',
  'Travel Agency': 'آژانس سیاحتی',
  'Tech Development': 'توسعه تکنالوژی',
  'Media Production': 'تولیدات رسانه‌ای',
  'Education': 'تحصیلات',
  'Travel': 'سیاحت',
  'Technology': 'تکنالوژی',
  'Media': 'رسانه',
  'Company': 'شرکت',
  'All': 'همه',
  'Search': 'جستجو',
  'Search website': 'جستجوی وب‌سایت',
  'Search Afghan Power Group...': 'جستجو در افغان پاور گروپ...',
  'QUICK DISCOVERY': 'دسترسی سریع',
  'No matching service yet.': 'موردی پیدا نشد.',
  'Static search preview': 'جستجوی سریع سایت',
  'Language': 'زبان',
  'Choose interface language': 'زبان رابط را انتخاب کنید',
  'English': 'انگلیسی',
  'Dari': 'دری',
  'Pashto': 'پشتو',
  'Right to left': 'راست به چپ',
  'Left to right': 'چپ به راست',
  'Notifications': 'اعلان‌ها',
  'No notifications right now.': 'فعلاً اعلانی وجود ندارد.',
  'Sign in': 'ورود',
  'Sign up': 'ثبت‌نام',
  'Password': 'رمز عبور',
  'Confirm password': 'تأیید رمز عبور',
  'Email': 'ایمیل',
  'Email or phone': 'ایمیل یا شماره تماس',
  'Phone': 'شماره تماس',
  'Full name': 'نام کامل',
  'Or continue with Google': 'یا با گوگل ادامه دهید',
  'At least 8 characters': 'حداقل ۸ کاراکتر',
  'Repeat password': 'رمز عبور را تکرار کنید',
  'Products & Packages': 'محصولات و بسته‌ها',
  'Explore Our Products & Packages': 'محصولات و بسته‌های ما را بررسی کنید',
  'Discover education packages, travel services, ready-made software and media solutions from across Afghan Power Group.': 'بسته‌های تحصیلی، خدمات سفر، نرم‌افزارهای آماده و راهکارهای رسانه‌ای افغان پاور گروپ را بررسی کنید.',
  'All Products': 'همه محصولات',
  'Search products, packages, visas, databases...': 'جستجوی محصولات، بسته‌ها، ویزاها و دیتابیس‌ها...',
  'CURATED CATALOG': 'کاتالوگ منتخب',
  'Technology Products': 'محصولات تکنالوژی',
  'Education Products': 'محصولات تحصیلی',
  'Travel Products': 'محصولات سیاحتی',
  'Media Products': 'محصولات رسانه‌ای',
  'No products found': 'محصولی پیدا نشد',
  'Try another keyword or category.': 'کلمه یا کتگوری دیگری را امتحان کنید.',
  'Show all products': 'نمایش همه محصولات',
  'Loading products…': 'در حال بارگذاری محصولات…',
  'Products unavailable': 'محصولات در دسترس نیست',
  'Try again': 'تلاش دوباره',
  'Back to products': 'بازگشت به محصولات',
  'Request a Consultation': 'درخواست مشاوره',
  'Contact for Price': 'برای قیمت تماس بگیرید',
  'About this product': 'درباره این محصول',
  'Recommended for': 'مناسب برای',
  'Information': 'معلومات',
  'OUR SERVICES': 'خدمات ما',
  'Choose the right service from one trusted group.': 'خدمت مناسب را از یک مجموعه معتبر انتخاب کنید.',
  'Education, travel, technology and media support in one clear catalog — built for students, families, businesses and growing brands.': 'خدمات آموزشی، سیاحتی، تکنالوژی و رسانه در یک کاتالوگ منظم برای محصلان، خانواده‌ها، تجارت‌ها و برندهای در حال رشد.',
  'Explore services': 'مشاهده خدمات',
  'Talk to our team': 'با تیم ما صحبت کنید',
  'SPECIALIZED CAPABILITIES': 'توانمندی‌های تخصصی',
  'Four divisions. One standard of service.': 'چهار بخش، یک معیار خدمات.',
  'Choose a division or browse everything we can do. The catalog is structured to grow as Afghan Power Group adds new services.': 'یک بخش را انتخاب کنید یا همه خدمات ما را ببینید. این کاتالوگ با افزودن خدمات جدید افغان پاور گروپ گسترش می‌یابد.',
  'All Services': 'همه خدمات',
  'Search services...': 'جستجوی خدمات...',
  'Professional support · Clear process · One trusted group': 'پشتیبانی حرفه‌ای · روند روشن · یک مجموعه معتبر',
  'Loading services…': 'در حال بارگذاری خدمات…',
  'Services unavailable': 'خدمات در دسترس نیست',
  'No services found': 'خدمتی پیدا نشد',
  'Try another keyword or switch to a different division.': 'کلمه دیگری جستجو کنید یا بخش دیگری را انتخاب کنید.',
  'Show all services': 'نمایش همه خدمات',
  'HOW WE WORK': 'شیوه کار ما',
  'Clear steps from first conversation to final delivery.': 'مراحل روشن از اولین گفتگو تا تحویل نهایی.',
  'Consult': 'مشاوره',
  'Plan': 'برنامه‌ریزی',
  'Execute': 'اجرا',
  'Deliver': 'تحویل',
  'Support': 'پشتیبانی',
  'NEED SOMETHING SPECIFIC?': 'به چیز مشخصی نیاز دارید؟',
  'Can’t find exactly what you need?': 'چیزی را که نیاز دارید پیدا نکردید؟',
  'Tell us what you want — we’ll connect you with the right Afghan Power team and build the right solution.': 'نیاز خود را با ما شریک کنید؛ شما را به تیم مناسب افغان پاور وصل می‌کنیم و راهکار مناسب را می‌سازیم.',
  'Talk to Our Team': 'با تیم ما صحبت کنید',
  'AFGHAN POWER NEWSROOM': 'اخبار افغان پاور',
  'Latest updates from Afghan Power Group.': 'تازه‌ترین خبرهای افغان پاور گروپ.',
  'Follow company news, new services, travel updates, education opportunities, technology releases and media announcements from one trusted group.': 'خبرهای شرکت، خدمات جدید، تازه‌های سفر، فرصت‌های تحصیلی، محصولات تکنالوژی و اعلان‌های رسانه‌ای را دنبال کنید.',
  'FEATURED NEWS': 'خبرهای ویژه',
  'New and trending stories.': 'خبرهای تازه و پربازدید.',
  'View all': 'مشاهده همه',
  'Loading news…': 'در حال بارگذاری اخبار…',
  'LATEST STORIES': 'آخرین خبرها',
  'News list.': 'فهرست خبرها',
  'Filter news': 'فیلتر اخبار',
  'Search news...': 'جستجوی اخبار...',
  'Category': 'کتگوری',
  'Date': 'تاریخ',
  'Any time': 'هر زمان',
  'This week': 'این هفته',
  'This month': 'این ماه',
  'No news matched this filter.': 'خبری مطابق این فیلتر پیدا نشد.',
  'OUR STORY': 'داستان ما',
  'Built step by step.': 'گام‌به‌گام ساخته شد.',
  'Designed to grow together.': 'برای رشد مشترک طراحی شد.',
  'Our story is not about one service. It is about building specialized companies that can grow independently and create more value together.': 'داستان ما درباره یک خدمت نیست؛ درباره ساخت شرکت‌های تخصصی است که مستقل رشد کنند و در کنار هم ارزش بیشتری ایجاد نمایند.',
  'LEADERSHIP': 'رهبری',
  'Leadership with a': 'رهبری با',
  'group-wide perspective.': 'دیدگاه جامع برای تمام مجموعه.',
  'Afghan Power Group combines central leadership with specialized teams so each division can stay focused while moving toward the same long-term direction.': 'افغان پاور گروپ رهبری مرکزی را با تیم‌های تخصصی ترکیب کرده تا هر بخش با تمرکز خود در مسیر یک هدف بلندمدت مشترک حرکت کند.',
  'CONTACT AFGHAN POWER GROUP': 'تماس با افغان پاور گروپ',
  'Start with the': 'از',
  'right team.': 'تیم مناسب شروع کنید.',
  'Education, travel, technology or media — tell us what you need and we’ll help you reach the right division without the back-and-forth.': 'تحصیلات، سفر، تکنالوژی یا رسانه — نیازتان را بگویید تا شما را مستقیم به بخش مناسب وصل کنیم.',
  'Specialized divisions': 'بخش‌های تخصصی',
  'Unified contact point': 'مرکز تماس واحد',
  'Digital inquiries': 'درخواست‌های آنلاین',
  'QUICK CONTACT': 'تماس سریع',
  'Reach the group directly': 'مستقیم با مجموعه تماس بگیرید',
  'CALL US': 'تماس',
  'EMAIL': 'ایمیل',
  'OFFICE': 'دفتر',
  'Contact details are managed from the Afghan Power admin panel.': 'معلومات تماس از پنل مدیریت افغان پاور تنظیم می‌شود.',
  'CHOOSE A DIVISION': 'یک بخش را انتخاب کنید',
  'Talk to the right team.': 'با تیم مناسب صحبت کنید.',
  'Each company has its own specialized services while remaining connected under Afghan Power Group.': 'هر شرکت خدمات تخصصی خود را دارد و در عین حال زیر مجموعه افغان پاور گروپ فعالیت می‌کند.',
  'Contact this division': 'تماس با این بخش',
  'SEND A MESSAGE': 'ارسال پیام',
  'Tell us what you need.': 'نیازتان را با ما شریک کنید.',
  'Your message will be delivered directly to the admin inbox.': 'پیام شما مستقیماً به صندوق پیام‌های مدیریت ارسال می‌شود.',
  'Full Name': 'نام کامل',
  'Phone Number': 'شماره تماس',
  'Email Address': 'آدرس ایمیل',
  'Select Division': 'انتخاب بخش',
  'Select Service': 'انتخاب خدمت',
  'Subject': 'موضوع',
  'Message': 'پیام',
  'Choose a division': 'یک بخش را انتخاب کنید',
  'Choose a service': 'یک خدمت را انتخاب کنید',
  'Other': 'سایر',
  'How can we help?': 'چگونه می‌توانیم کمک کنیم؟',
  'Tell us a little about what you need...': 'کمی درباره نیازتان بنویسید...',
  'Send Message': 'ارسال پیام',
  'Sending…': 'در حال ارسال…',
  'We usually respond during working hours.': 'معمولاً در ساعات کاری پاسخ می‌دهیم.',
  'Your message has been sent successfully.': 'پیام شما با موفقیت ارسال شد.',
  'PHONE': 'تلفن',
  'WHATSAPP': 'واتساپ',
  'WORKING HOURS': 'ساعات کاری',
  'Call us': 'تماس بگیرید',
  'FIND OUR OFFICE': 'دفتر ما را پیدا کنید',
  'OUR LOCATION': 'موقعیت ما',
  'Kabul, Afghanistan': 'کابل، افغانستان',
  'A shared vision': 'یک دیدگاه مشترک',
  'Administration & Finance': 'اداره و مالی',
  'Admissions · Scholarships · Student visas': 'پذیرش · بورسیه · ویزای تحصیلی',
  'Advertising, video production, branding, design and digital marketing services.': 'تبلیغات، تولید ویدیو، برندینگ، طراحی و خدمات بازاریابی دیجیتال.',
  'Advertising, video production, graphic design, digital marketing and content that moves brands forward.': 'تبلیغات، تولید ویدیو، طراحی گرافیک، بازاریابی دیجیتال و محتوایی که برندها را به پیش می‌برد.',
  'Afghan Power Group': 'افغان پاور گروپ',
  'Afghan Power Group divisions': 'بخش‌های افغان پاور گروپ',
  'Afghan Power Group logo': 'لوگوی افغان پاور گروپ',
  'Afghan Power Group office location': 'موقعیت دفتر افغان پاور گروپ',
  'Afghan Power began with a simple idea: bring practical, professional services together around the real needs of Afghan clients.': 'افغان پاور با یک ایده ساده آغاز شد: گردهم‌آوردن خدمات عملی و حرفه‌ای بر اساس نیازهای واقعی مشتریان افغان.',
  'Afghan Power home': 'خانه افغان پاور',
  'Afghan Power service areas': 'حوزه‌های خدمات افغان پاور',
  'Air Tickets & Travel': 'تکت هوایی و سفر',
  'BEYOND': 'فراتر از',
  'BORDERS': 'مرزها',
  'BUILD': 'بسازید',
  'Become a trusted multi-service Afghan business group.': 'تبدیل‌شدن به یک مجموعه معتبر افغانی با خدمات متنوع.',
  'Building what comes next': 'ساختن آینده',
  'Business Development Lead': 'مسئول توسعه تجارت',
  'Business software, ERP systems, websites, mobile applications and custom digital solutions for modern organizations.': 'نرم‌افزارهای تجارتی، سیستم‌های ERP، وب‌سایت‌ها، اپلیکیشن‌های موبایل و راهکارهای دیجیتال اختصاصی برای سازمان‌های مدرن.',
  'CREATE': 'خلق کنید',
  'Change language': 'تغییر زبان',
  'Chief Executive Officer': 'مدیر اجرایی',
  'Clear Relationships': 'روابط شفاف',
  'Clear notifications': 'پاک‌کردن اعلان‌ها',
  'Clear search': 'پاک‌کردن جستجو',
  'Clear student visa guidance, document preparation and application support from first review to final submission.': 'راهنمایی روشن ویزای تحصیلی، آماده‌سازی اسناد و پشتیبانی درخواست از بررسی نخست تا ارسال نهایی.',
  'Client Relations Lead': 'مسئول روابط مشتریان',
  'Close account modal': 'بستن پنجره حساب',
  'Close image preview': 'بستن پیش‌نمایش تصویر',
  'Close search': 'بستن جستجو',
  'Coordinates educational consultancy services, student support and international study opportunities across the division.': 'خدمات مشاوره تحصیلی، پشتیبانی محصلان و فرصت‌های تحصیل بین‌المللی را در این بخش هماهنگ می‌کند.',
  'Core companies': 'شرکت‌های اصلی',
  'Create account.': 'ایجاد حساب',
  'Creating…': 'در حال ایجاد…',
  'Creative Media': 'رسانه خلاق',
  'Creative production, advertising, brand design, social content and digital marketing that helps businesses communicate with impact.': 'تولید خلاق، تبلیغات، طراحی برند، محتوای شبکه‌های اجتماعی و بازاریابی دیجیتال برای ارتباط مؤثر تجارت‌ها.',
  'Custom databases, ERP systems and business software that connect operations, finance, teams and reporting.': 'دیتابیس‌های اختصاصی، سیستم‌های ERP و نرم‌افزارهای تجارتی که عملیات، مالی، تیم‌ها و گزارش‌دهی را یکپارچه می‌کنند.',
  'Dark mode': 'حالت تاریک',
  'Database systems, ERP platforms, websites, applications and custom software for modern businesses.': 'سیستم‌های دیتابیس، پلتفرم‌های ERP، وب‌سایت‌ها، اپلیکیشن‌ها و نرم‌افزارهای اختصاصی برای تجارت‌های مدرن.',
  'Develops partnerships, identifies growth opportunities and supports the expansion of group services and products.': 'همکاری‌ها را توسعه می‌دهد، فرصت‌های رشد را شناسایی می‌کند و از گسترش خدمات و محصولات مجموعه پشتیبانی می‌کند.',
  'Digital Solutions': 'راهکارهای دیجیتال',
  'Discover suitable scholarship opportunities and prepare stronger applications for competitive study programs.': 'فرصت‌های مناسب بورسیه را پیدا کنید و برای برنامه‌های رقابتی تحصیلی درخواست‌های قوی‌تر آماده کنید.',
  'EDUCATION': 'تحصیلات',
  'ENGAGE': 'تعامل کنید',
  'ERP · Databases · Websites · Apps': 'ERP · دیتابیس · وب‌سایت · اپلیکیشن',
  'Each division focuses on its own field while sharing a common standard of service.': 'هر بخش روی حوزه تخصصی خود تمرکز دارد و همزمان یک معیار مشترک خدمات را دنبال می‌کند.',
  'Education Division Lead': 'مسئول بخش تحصیلات',
  'Education services': 'خدمات تحصیلی',
  'Education, travel, technology and media expertise under one coordinated brand.': 'تخصص در تحصیلات، سفر، تکنالوژی و رسانه زیر یک برند هماهنگ.',
  'Education, travel, technology and media services brought together under one trusted Afghan brand.': 'خدمات تحصیلی، سیاحتی، تکنالوژی و رسانه زیر یک برند معتبر افغانی گردهم آمده‌اند.',
  'Email or phone number': 'ایمیل یا شماره تماس',
  'Explore Our Companies': 'شرکت‌های ما را ببینید',
  'FUTURE': 'آینده',
  'Facebook': 'فیسبوک',
  'Filter and search products': 'فیلتر و جستجوی محصولات',
  'Filter products by division': 'فیلتر محصولات بر اساس بخش',
  'Filter services': 'فیلتر خدمات',
  'Flight ticketing and reliable travel assistance designed around your destination, schedule and journey needs.': 'تکت هوایی و خدمات مطمئن سفر بر اساس مقصد، برنامه زمانی و نیازهای سفر شما.',
  'Focuses on client communication, service quality and creating a smoother experience across the Afghan Power Group.': 'بر ارتباط با مشتری، کیفیت خدمات و ایجاد تجربه‌ای روان‌تر در سراسر افغان پاور گروپ تمرکز دارد.',
  'Founder & Director': 'بنیان‌گذار و مدیر',
  'From international services to digital systems, we combine practical experience with modern tools and processes.': 'از خدمات بین‌المللی تا سیستم‌های دیجیتال، تجربه عملی را با ابزارها و روندهای مدرن ترکیب می‌کنیم.',
  'Google sign-in failed. Please try again.': 'ورود با گوگل ناموفق بود. دوباره تلاش کنید.',
  'Guides software, ERP, database, web and mobile development projects across Afghan Power Tech Development.': 'پروژه‌های نرم‌افزار، ERP، دیتابیس، وب و موبایل را در افغان پاور تک دیولوپمنت رهبری می‌کند.',
  'INSPIRE': 'الهام‌بخش باشید',
  'Integrated solutions': 'راهکارهای یکپارچه',
  'International admissions, scholarships, study visa guidance and practical support for students planning their next academic step.': 'پذیرش بین‌المللی، بورسیه، راهنمایی ویزای تحصیلی و پشتیبانی عملی برای محصلانی که گام بعدی تحصیلی خود را برنامه‌ریزی می‌کنند.',
  'Latest updates': 'تازه‌ترین خبرها',
  'Leadership team carousel': 'اسلایدر تیم رهبری',
  'Leads creative production, branding, advertising and digital media services for clients and group companies.': 'تولید خلاق، برندینگ، تبلیغات و خدمات رسانه دیجیتال را برای مشتریان و شرکت‌های مجموعه رهبری می‌کند.',
  'Leads group operations, service development and the execution of Afghan Power Group’s growth across its core divisions.': 'عملیات مجموعه، توسعه خدمات و اجرای برنامه‌های رشد افغان پاور گروپ را در بخش‌های اصلی رهبری می‌کند.',
  'Learn more': 'بیشتر بدانید',
  'Light mode': 'حالت روشن',
  'LinkedIn': 'لینکدین',
  'Local Expertise': 'تخصص محلی',
  'Local Understanding': 'درک محلی',
  'Long-Term Support': 'پشتیبانی درازمدت',
  'Long-Term Value': 'ارزش درازمدت',
  'MEDIA': 'رسانه',
  'MISSION': 'ماموریت',
  'Make professional services easier to access.': 'دسترسی به خدمات حرفه‌ای را آسان‌تر کنیم.',
  'Mark all as read': 'همه را خوانده‌شده علامت بزن',
  'Media & Digital Marketing': 'رسانه و بازاریابی دیجیتال',
  'Media Division Lead': 'مسئول بخش رسانه',
  'Media services': 'خدمات رسانه‌ای',
  'Modern Solutions': 'راهکارهای مدرن',
  'Modern Thinking': 'تفکر مدرن',
  'Modern websites and applications with polished interfaces, responsive layouts and scalable foundations.': 'وب‌سایت‌ها و اپلیکیشن‌های مدرن با رابط حرفه‌ای، طراحی واکنش‌گرا و زیرساخت قابل توسعه.',
  'Multiple Services, One Group': 'خدمات متعدد، یک مجموعه',
  'Next image': 'تصویر بعدی',
  'OUR VALUES': 'ارزش‌های ما',
  'One Group, Multiple Services': 'یک مجموعه، خدمات متعدد',
  'Open account menu': 'بازکردن منوی حساب',
  'Open menu': 'بازکردن منو',
  'Open notifications': 'بازکردن اعلان‌ها',
  'Operations Manager': 'مدیر عملیات',
  'Our support continues beyond delivery with consultation, follow-up and ongoing assistance when you need it.': 'پشتیبانی ما پس از تحویل نیز با مشاوره، پیگیری و کمک دوامدار ادامه می‌یابد.',
  'Our vision is to build strong local companies that connect people and businesses with opportunities at home and internationally.': 'دیدگاه ما ساخت شرکت‌های محلی قدرتمند است که افراد و تجارت‌ها را به فرصت‌های داخلی و بین‌المللی وصل کنند.',
  'Oversees travel services, visa assistance, ticketing and client coordination for international journeys.': 'خدمات سفر، کمک ویزا، تکت و هماهنگی مشتریان برای سفرهای بین‌المللی را مدیریت می‌کند.',
  'POWERING': 'قدرت‌بخش',
  'Passwords do not match.': 'رمزهای عبور مطابقت ندارند.',
  'Previous image': 'تصویر قبلی',
  'Primary navigation': 'منوی اصلی',
  'Product image preview': 'پیش‌نمایش تصویر محصول',
  'Product images': 'تصاویر محصول',
  'Professional Team': 'تیم حرفه‌ای',
  'Professional service consultation': 'مشاوره خدمات حرفه‌ای',
  'Professional tourist visa consultation, document checks and practical support for smoother international travel.': 'مشاوره حرفه‌ای ویزای توریستی، بررسی اسناد و پشتیبانی عملی برای سفر بین‌المللی آسان‌تر.',
  'Provides strategic direction for the group and supports the long-term development of its companies and partnerships.': 'جهت‌گیری استراتژیک مجموعه را تعیین می‌کند و از توسعه درازمدت شرکت‌ها و همکاری‌های آن پشتیبانی می‌کند.',
  'Reach Afghan Power Group directly for education, travel, technology and media inquiries.': 'برای درخواست‌های تحصیلی، سفر، تکنالوژی و رسانه مستقیماً با افغان پاور گروپ تماس بگیرید.',
  'STUDY': 'تحصیل',
  'Sat – Thu · 8:30 AM – 5:00 PM': 'شنبه تا پنج‌شنبه · ۸:۳۰ صبح تا ۵:۰۰ عصر',
  'Scholarships': 'بورسیه‌ها',
  'Search Afghan Power Group': 'جستجو در افغان پاور گروپ',
  'Search products': 'جستجوی محصولات',
  'Search services': 'جستجوی خدمات',
  'Service divisions': 'بخش‌های خدمات',
  'Service mindset': 'روحیه خدمت',
  'Signing in…': 'در حال ورود…',
  'Social links': 'لینک‌های اجتماعی',
  'Software & ERP': 'نرم‌افزار و ERP',
  'Software, databases, ERP systems, websites and custom digital solutions.': 'نرم‌افزار، دیتابیس، سیستم‌های ERP، وب‌سایت و راهکارهای دیجیتال اختصاصی.',
  'Solutions are shaped around Afghan clients, businesses and practical local realities.': 'راهکارها بر اساس نیازهای مشتریان افغان، تجارت‌ها و واقعیت‌های عملی محلی طراحی می‌شوند.',
  'Specialized Teams': 'تیم‌های تخصصی',
  'Specialized sectors': 'بخش‌های تخصصی',
  'Specialized teams across every division, focused on quality, clear communication and client success.': 'تیم‌های تخصصی در هر بخش با تمرکز بر کیفیت، ارتباط شفاف و موفقیت مشتری.',
  'Straightforward communication and structured service keep every engagement easier to follow.': 'ارتباط روشن و خدمات ساختاریافته باعث می‌شود هر همکاری آسان‌تر قابل پیگیری باشد.',
  'Structured service delivery, clear steps and consistent updates help clients know what happens next.': 'ارائه ساختاریافته خدمات، مراحل روشن و اطلاع‌رسانی منظم باعث می‌شود مشتری بداند گام بعدی چیست.',
  'Study Abroad': 'تحصیل در خارج',
  'Study Visa': 'ویزای تحصیلی',
  'Study visas, university admissions, scholarships and international education guidance.': 'ویزای تحصیلی، پذیرش دانشگاه، بورسیه و راهنمایی تحصیل بین‌المللی.',
  'Support for international university applications, offer letters and the admission journey from start to finish.': 'پشتیبانی درخواست دانشگاه‌های بین‌المللی، آفرلتر و روند پذیرش از آغاز تا پایان.',
  'Supports administrative coordination and financial organization across the group’s operating companies.': 'هماهنگی اداری و تنظیم امور مالی را در شرکت‌های فعال مجموعه پشتیبانی می‌کند.',
  'Supports day-to-day coordination across divisions and keeps group operations aligned with service standards.': 'هماهنگی روزمره میان بخش‌ها را پشتیبانی کرده و عملیات مجموعه را با معیارهای خدمات هماهنگ نگه می‌دارد.',
  'Switch to dark mode': 'تغییر به حالت تاریک',
  'Switch to light mode': 'تغییر به حالت روشن',
  'TECHNOLOGY': 'تکنالوژی',
  'THE DIGITAL': 'دنیای دیجیتال',
  'TRAVEL': 'سیاحت',
  'Technology Division Lead': 'مسئول بخش تکنالوژی',
  'Technology services': 'خدمات تکنالوژی',
  'The group expanded into focused teams for education, travel, technology and media while keeping one unified standard of service.': 'مجموعه به تیم‌های تخصصی در تحصیلات، سفر، تکنالوژی و رسانه گسترش یافت، در حالی که یک معیار واحد خدمات حفظ شد.',
  'The requested product is not available in the current catalog.': 'محصول درخواستی در کاتالوگ فعلی موجود نیست.',
  'Today, our divisions work independently where expertise matters and together where clients benefit from connected services.': 'امروز بخش‌های ما در حوزه‌های تخصصی مستقل کار می‌کنند و جایی که مشتری از خدمات یکپارچه سود می‌برد با هم همکاری می‌کنند.',
  'Tourist Visa': 'ویزای توریستی',
  'Tourist visas · Tickets · Travel services': 'ویزای توریستی · تکت · خدمات سفر',
  'Tourist visas, air tickets and reliable travel services designed to make every journey easier.': 'ویزای توریستی، تکت هوایی و خدمات مطمئن سفر برای آسان‌ترشدن هر سفر.',
  'Tourist visas, air tickets, travel packages and practical journey support.': 'ویزای توریستی، تکت هوایی، بسته‌های سفر و پشتیبانی عملی سفر.',
  'Tourist visas, ticketing and travel assistance designed to make international journeys clearer, simpler and better supported.': 'ویزای توریستی، تکت و کمک سفر برای سفرهای بین‌المللی روشن‌تر، ساده‌تر و بهتر پشتیبانی‌شده.',
  'Transparent Process': 'روند شفاف',
  'Travel Division Lead': 'مسئول بخش سفر',
  'Travel Services': 'خدمات سفر',
  'Travel services': 'خدمات سفر',
  'Trust, progress, quality and long-term relationships.': 'اعتماد، پیشرفت، کیفیت و روابط درازمدت.',
  'Unable to load news.': 'بارگذاری اخبار ممکن نشد.',
  'Unable to load products.': 'بارگذاری محصولات ممکن نشد.',
  'Unable to load services.': 'بارگذاری خدمات ممکن نشد.',
  'Unable to load this product.': 'بارگذاری این محصول ممکن نشد.',
  'Unable to send message.': 'ارسال پیام ممکن نشد.',
  'Unable to sign in. Please try again.': 'ورود ممکن نشد. دوباره تلاش کنید.',
  'Unified group': 'مجموعه یکپارچه',
  'University Admission': 'پذیرش دانشگاه',
  'University admissions, scholarships and student visa guidance for international study opportunities.': 'پذیرش دانشگاه، بورسیه و راهنمایی ویزای تحصیلی برای فرصت‌های تحصیل بین‌المللی.',
  'Use the map below to find our office.': 'برای پیداکردن دفتر ما از نقشه زیر استفاده کنید.',
  'VISION': 'دیدگاه',
  'Video production, graphic design, advertising, digital marketing and content that helps brands stand out.': 'تولید ویدیو، طراحی گرافیک، تبلیغات، بازاریابی دیجیتال و محتوایی که برندها را برجسته می‌کند.',
  'Video · Design · Advertising · Digital marketing': 'ویدیو · طراحی · تبلیغات · بازاریابی دیجیتال',
  'Visit us in Kabul.': 'در کابل به دیدن ما بیایید.',
  'Visit, call or message us.': 'به ما مراجعه کنید، تماس بگیرید یا پیام بدهید.',
  'We aim to create useful results and relationships that remain valuable after delivery.': 'هدف ما ایجاد نتایج و روابطی است که پس از تحویل نیز ارزشمند بمانند.',
  'We bring specialized support, clear processes and practical solutions together so clients can move forward with confidence.': 'پشتیبانی تخصصی، روندهای روشن و راهکارهای عملی را یکجا می‌کنیم تا مشتریان با اطمینان پیش بروند.',
  'We combine proven processes with new tools, digital systems and better customer experiences.': 'روندهای ثابت‌شده را با ابزارهای جدید، سیستم‌های دیجیتال و تجربه بهتر مشتری ترکیب می‌کنیم.',
  'We continue to grow our products, partnerships and capabilities with a long-term focus on useful innovation and dependable support.': 'به رشد محصولات، همکاری‌ها و توانایی‌های خود با تمرکز درازمدت بر نوآوری مفید و پشتیبانی قابل اعتماد ادامه می‌دهیم.',
  'We understand the Afghan market, local expectations and the practical needs of people and businesses.': 'بازار افغانستان، انتظارات محلی و نیازهای عملی مردم و تجارت‌ها را درک می‌کنیم.',
  'We value transparent communication, useful innovation, professional execution and support that continues beyond delivery.': 'برای ارتباط شفاف، نوآوری مفید، اجرای حرفه‌ای و پشتیبانی پس از تحویل ارزش قائل هستیم.',
  'Web & Mobile Development': 'توسعه وب و موبایل',
  'Website tools': 'ابزارهای وب‌سایت',
  'Welcome back.': 'خوش آمدید.',
  'Why Afghan Power Group categories': 'دسته‌بندی دلایل انتخاب افغان پاور گروپ',
  'YOUR FUTURE': 'آینده شما',
  'Your full name': 'نام کامل شما',
  'Zoom product image': 'بزرگ‌نمایی تصویر محصول',
  'Please wait while the catalog is prepared.': 'لطفاً منتظر بمانید تا کاتالوگ آماده شود.',
  'Products could not be loaded.': 'محصولات بارگذاری نشد.',
  'PRICING': 'قیمت',
  'View Details': 'مشاهده جزئیات',
  'No matching products found.': 'محصول مطابق پیدا نشد.',
  'Please wait while the product details are prepared.': 'لطفاً منتظر بمانید تا جزئیات محصول آماده شود.',
  'Product not found': 'محصول پیدا نشد',
  'Scroll over the gallery or use the arrows to change images.': 'روی گالری حرکت کنید یا از فلش‌ها برای تغییر تصاویر استفاده کنید.',
  'Final terms, timelines and requirements are confirmed during consultation before any application, booking or project starts.': 'شرایط نهایی، زمان‌بندی و الزامات پیش از آغاز هر درخواست، رزرو یا پروژه در جریان مشاوره تأیید می‌شود.',
  'YOU MAY ALSO LIKE': 'پیشنهادهای دیگر',
  'We build.': 'ما می‌سازیم.',
  'We connect.': 'ما وصل می‌کنیم.',
  'We grow.': 'ما رشد می‌کنیم.',
  'AFGHAN POWER': 'افغان پاور',
  'GROUP OF COMPANIES': 'گروپ شرکت‌ها',
  'ONE GROUP': 'یک مجموعه',
  'Different expertise.': 'تخصص‌های متفاوت.',
  'One shared standard.': 'یک معیار مشترک.',
  'Four focused companies.': 'چهار شرکت تخصصی.',
  'One powerful group.': 'یک مجموعه قدرتمند.',
  'Each division is built around a specific field, making it easier for clients to find focused expertise while staying connected to the wider group.': 'هر بخش پیرامون یک حوزه مشخص ساخته شده تا مشتریان آسان‌تر به تخصص مورد نیاز دسترسی پیدا کنند و در عین حال با کل مجموعه در ارتباط بمانند.',
  'Explore division': 'مشاهده بخش',
  'Built around useful service, not unnecessary complexity.': 'بر پایه خدمات مفید، نه پیچیدگی غیرضروری.',
  'Our group structure helps clients access specialist teams while keeping communication, quality and support connected.': 'ساختار مجموعه ما دسترسی مشتریان به تیم‌های تخصصی را آسان می‌کند و در عین حال ارتباط، کیفیت و پشتیبانی را یکپارچه نگه می‌دارد.',
  'Account': 'حساب',
  'Escape': 'خروج',
  'services available': 'خدمت موجود',
  'products available': 'محصول موجود',
  'stories found': 'خبر پیدا شد',
  'Updated': 'به‌روزرسانی',
  'Loading product…': 'در حال بارگذاری محصول…',
}

const ps: Dictionary = {
  'Home': 'کور', 'Products': 'محصولات', 'Services': 'خدمتونه', 'News': 'خبرونه', 'About': 'زموږ په اړه', 'Contact': 'اړیکه',
  'Contact us': 'له موږ سره اړیکه', 'Companies': 'شرکتونه', 'Navigation': 'لارښود', 'Get in touch': 'اړیکه ونیسئ',
  'Explore Services': 'خدمتونه وګورئ', 'Discover Afghan Power': 'افغان پاور وپېژنئ', 'Core Divisions': 'اصلي برخې', 'Unified Group': 'یو متحد ګروپ', 'Business Solutions': 'سوداګریز حلونه',
  'WHAT WE DO': 'زموږ خدمتونه', 'One group.': 'یو ګروپ.', 'Many possibilities.': 'ډېر امکانات.',
  'Education': 'زده کړې', 'Travel': 'سفر', 'Technology': 'ټکنالوژي', 'Media': 'رسنۍ', 'Company': 'شرکت', 'All': 'ټول',
  'Language': 'ژبه', 'Choose interface language': 'د انترفېس ژبه وټاکئ', 'English': 'انګلیسي', 'Dari': 'دري', 'Pashto': 'پښتو', 'Right to left': 'له ښي څخه چپ ته', 'Left to right': 'له چپ څخه ښي ته',
  'Notifications': 'خبرتیاوې', 'No notifications right now.': 'اوس مهال خبرتیا نشته.', 'Search': 'لټون', 'Search website': 'په ویب‌سایټ کې لټون', 'Search Afghan Power Group...': 'په افغان پاور ګروپ کې لټون...',
  'All Products': 'ټول محصولات', 'No products found': 'محصول ونه موندل شو', 'Try again': 'بیا هڅه وکړئ', 'Back to products': 'محصولاتو ته بېرته',
  'OUR SERVICES': 'زموږ خدمتونه', 'All Services': 'ټول خدمتونه', 'Search services...': 'خدمتونه ولټوئ...', 'No services found': 'خدمت ونه موندل شو', 'Show all services': 'ټول خدمتونه وښایئ',
  'Consult': 'مشوره', 'Plan': 'پلان', 'Execute': 'اجرا', 'Deliver': 'سپارل', 'Support': 'ملاتړ', 'Talk to Our Team': 'زموږ له ټیم سره خبرې وکړئ',
  'AFGHAN POWER NEWSROOM': 'د افغان پاور خبرونه', 'FEATURED NEWS': 'ځانګړي خبرونه', 'LATEST STORIES': 'وروستي خبرونه', 'Filter news': 'خبرونه فلټر کړئ', 'Category': 'کټګوري', 'Date': 'نېټه', 'Any time': 'هر وخت', 'This week': 'دا اونۍ', 'This month': 'دا میاشت',
  'OUR STORY': 'زموږ کیسه', 'LEADERSHIP': 'مشرتابه',
  'CONTACT AFGHAN POWER GROUP': 'له افغان پاور ګروپ سره اړیکه', 'QUICK CONTACT': 'چټکه اړیکه', 'CALL US': 'زنګ ووهئ', 'EMAIL': 'برېښنالیک', 'OFFICE': 'دفتر',
  'CHOOSE A DIVISION': 'یوه برخه وټاکئ', 'Talk to the right team.': 'له مناسب ټیم سره خبرې وکړئ.', 'Contact this division': 'له دې برخې سره اړیکه',
  'SEND A MESSAGE': 'پیغام واستوئ', 'Tell us what you need.': 'خپله اړتیا راته ووایئ.', 'Full Name': 'بشپړ نوم', 'Phone Number': 'د تلیفون شمېره', 'Email Address': 'برېښنالیک', 'Select Division': 'برخه وټاکئ', 'Select Service': 'خدمت وټاکئ', 'Subject': 'موضوع', 'Message': 'پیغام', 'Choose a division': 'یوه برخه وټاکئ', 'Choose a service': 'یو خدمت وټاکئ', 'Other': 'نور', 'Send Message': 'پیغام واستوئ', 'Sending…': 'لېږل کېږي…',
  'PHONE': 'تلیفون', 'WHATSAPP': 'واټساپ', 'WORKING HOURS': 'کاري ساعتونه', 'Call us': 'زنګ ووهئ', 'FIND OUR OFFICE': 'زموږ دفتر ومومئ', 'OUR LOCATION': 'زموږ پته', 'Kabul, Afghanistan': 'کابل، افغانستان',
  'A shared vision': 'یو ګډ لید',
  'Administration & Finance': 'اداره او مالي',
  'Admissions · Scholarships · Student visas': 'پذیرش · بورسونه · د زده‌کړې ویزې',
  'Advertising, video production, branding, design and digital marketing services.': 'اعلانونه، ویډیو تولید، برانډینګ، ډیزاین او ډیجیټل بازارموندنې خدمتونه.',
  'Afghan Power Group': 'افغان پاور ګروپ',
  'Afghan Power Group divisions': 'د افغان پاور ګروپ برخې',
  'Afghan Power Group office location': 'د افغان پاور ګروپ د دفتر موقعیت',
  'Afghan Power began with a simple idea: bring practical, professional services together around the real needs of Afghan clients.': 'افغان پاور له یوې ساده مفکورې پیل وکړ: د افغان مشتریانو د واقعي اړتیاوو پر بنسټ عملي او مسلکي خدمتونه یوځای کول.',
  'Air Tickets & Travel': 'هوایي ټکټونه او سفر',
  'BUILD': 'جوړ کړئ',
  'Business Development Lead': 'د سوداګرۍ د پراختیا مسئول',
  'CREATE': 'جوړ کړئ',
  'Change language': 'ژبه بدله کړئ',
  'Chief Executive Officer': 'اجرائیه رئیس',
  'Clear notifications': 'خبرتیاوې پاکې کړئ',
  'Clear search': 'لټون پاک کړئ',
  'Client Relations Lead': 'د مشتریانو د اړیکو مسئول',
  'Close search': 'لټون بند کړئ',
  'Create account.': 'حساب جوړ کړئ',
  'Creating…': 'جوړېږي…',
  'Dark mode': 'تیاره حالت',
  'Digital Solutions': 'ډیجیټل حلونه',
  'EDUCATION': 'زده کړې',
  'ENGAGE': 'اړیکه ونیسئ',
  'Each division focuses on its own field while sharing a common standard of service.': 'هره برخه پر خپل تخصص تمرکز کوي او د خدمت ګډ معیار تعقیبوي.',
  'Education Division Lead': 'د زده‌کړو د برخې مسئول',
  'Education services': 'د زده‌کړو خدمتونه',
  'Email or phone number': 'برېښنالیک یا د تلیفون شمېره',
  'Explore Our Companies': 'زموږ شرکتونه وګورئ',
  'FUTURE': 'راتلونکی',
  'Facebook': 'فېسبوک',
  'Filter products by division': 'محصولات د برخې له مخې فلټر کړئ',
  'Filter services': 'خدمتونه فلټر کړئ',
  'Founder & Director': 'بنسټګر او مدیر',
  'Google sign-in failed. Please try again.': 'د ګوګل له لارې ننوتل ناکام شول. بیا هڅه وکړئ.',
  'INSPIRE': 'الهام ورکړئ',
  'Integrated solutions': 'یوځای شوي حلونه',
  'Latest updates': 'وروستي تازه معلومات',
  'Leadership team carousel': 'د مشرتابه د ټیم سلایډر',
  'Learn more': 'نور معلومات',
  'Light mode': 'روښانه حالت',
  'LinkedIn': 'لینکډین',
  'Local Expertise': 'محلي تخصص',
  'Local Understanding': 'محلي درک',
  'Long-Term Support': 'اوږدمهاله ملاتړ',
  'Long-Term Value': 'اوږدمهاله ارزښت',
  'MEDIA': 'رسنۍ',
  'MISSION': 'ماموریت',
  'Make professional services easier to access.': 'مسلکي خدمتونو ته لاسرسی اسانه کول.',
  'Mark all as read': 'ټول لوستل شوي وښایئ',
  'Media & Digital Marketing': 'رسنۍ او ډیجیټل بازارموندنه',
  'Media Division Lead': 'د رسنیو د برخې مسئول',
  'Media services': 'د رسنیو خدمتونه',
  'Modern Solutions': 'عصري حلونه',
  'Modern Thinking': 'عصري فکر',
  'Multiple Services, One Group': 'ډېر خدمتونه، یو ګروپ',
  'Next image': 'بل انځور',
  'OUR VALUES': 'زموږ ارزښتونه',
  'One Group, Multiple Services': 'یو ګروپ، ډېر خدمتونه',
  'Open account menu': 'د حساب مېنو پرانیزئ',
  'Open menu': 'مېنو پرانیزئ',
  'Open notifications': 'خبرتیاوې پرانیزئ',
  'Operations Manager': 'د عملیاتو مدیر',
  'POWERING': 'ځواک ورکول',
  'Passwords do not match.': 'پاسورډونه یو شان نه دي.',
  'Previous image': 'مخکینی انځور',
  'Primary navigation': 'اصلي لارښود',
  'Product image preview': 'د محصول د انځور مخکتنه',
  'Product images': 'د محصول انځورونه',
  'Professional Team': 'مسلکي ټیم',
  'Professional service consultation': 'مسلکي مشوره',
  'Reach Afghan Power Group directly for education, travel, technology and media inquiries.': 'د زده‌کړو، سفر، ټکنالوژۍ او رسنیو لپاره له افغان پاور ګروپ سره مستقیمه اړیکه ونیسئ.',
  'STUDY': 'زده کړه',
  'Sat – Thu · 8:30 AM – 5:00 PM': 'شنبه تر پنجشنبې · ۸:۳۰ سهار تر ۵:۰۰ ماښام',
  'Scholarships': 'بورسونه',
  'Search Afghan Power Group': 'په افغان پاور ګروپ کې لټون',
  'Search products': 'محصولات ولټوئ',
  'Search services': 'خدمتونه ولټوئ',
  'Service divisions': 'د خدمت برخې',
  'Signing in…': 'ننوتل کېږي…',
  'Social links': 'ټولنیزې اړیکې',
  'Software & ERP': 'سافټویر او ERP',
  'Specialized Teams': 'تخصصي ټیمونه',
  'Specialized sectors': 'تخصصي سکتورونه',
  'Study Abroad': 'په بهر کې زده کړه',
  'Study Visa': 'د زده‌کړې ویزه',
  'Switch to dark mode': 'تیاره حالت ته بدلول',
  'Switch to light mode': 'روښانه حالت ته بدلول',
  'TECHNOLOGY': 'ټکنالوژي',
  'THE DIGITAL': 'ډیجیټل نړۍ',
  'TRAVEL': 'سفر',
  'Technology Division Lead': 'د ټکنالوژۍ د برخې مسئول',
  'Technology services': 'د ټکنالوژۍ خدمتونه',
  'The requested product is not available in the current catalog.': 'غوښتل شوی محصول په اوسني کتلاګ کې نشته.',
  'Tourist Visa': 'سیاحتي ویزه',
  'Travel Division Lead': 'د سفر د برخې مسئول',
  'Travel Services': 'د سفر خدمتونه',
  'Travel services': 'د سفر خدمتونه',
  'Transparent Process': 'روښانه بهیر',
  'Unable to load news.': 'خبرونه نه شي بارېدای.',
  'Unable to load products.': 'محصولات نه شي بارېدای.',
  'Unable to load services.': 'خدمتونه نه شي بارېدای.',
  'Unable to load this product.': 'دا محصول نه شي بارېدای.',
  'Unable to send message.': 'پیغام نه شي لېږل کېدای.',
  'Unable to sign in. Please try again.': 'ننوتل ونه شول. بیا هڅه وکړئ.',
  'Unified group': 'متحد ګروپ',
  'University Admission': 'د پوهنتون پذیرش',
  'Use the map below to find our office.': 'زموږ د دفتر د موندلو لپاره لاندې نقشه وکاروئ.',
  'VISION': 'لیدلوری',
  'Visit us in Kabul.': 'په کابل کې زموږ دفتر ته راشئ.',
  'Visit, call or message us.': 'راشئ، زنګ ووهئ یا پیغام راولېږئ.',
  'Web & Mobile Development': 'د ویب او موبایل پراختیا',
  'Website tools': 'د ویب‌سایټ وسایل',
  'Welcome back.': 'بیا ښه راغلاست.',
  'YOUR FUTURE': 'ستاسو راتلونکی',
  'Your full name': 'ستاسو بشپړ نوم',
  'Zoom product image': 'د محصول انځور لوی کړئ',
  'Please wait while the catalog is prepared.': 'مهرباني وکړئ د کتلاګ تر چمتو کېدو انتظار وکړئ.',
  'Products could not be loaded.': 'محصولات بار نه شول.',
  'PRICING': 'بیه',
  'View Details': 'جزیات وګورئ',
  'No matching products found.': 'مناسب محصول ونه موندل شو.',
  'Please wait while the product details are prepared.': 'مهرباني وکړئ د محصول د جزیاتو تر چمتو کېدو انتظار وکړئ.',
  'Product not found': 'محصول ونه موندل شو',
  'YOU MAY ALSO LIKE': 'کېدای شي دا هم خوښ کړئ',
  'View all': 'ټول وګورئ',
  'We build.': 'موږ جوړوو.',
  'We connect.': 'موږ نښلوو.',
  'We grow.': 'موږ وده کوو.',
  'Talk to our team': 'زموږ له ټیم سره خبرې وکړئ',
  'AFGHAN POWER': 'افغان پاور',
  'GROUP OF COMPANIES': 'د شرکتونو ګروپ',
  'ONE GROUP': 'یو ګروپ',
  'Different expertise.': 'بېلابېل تخصصونه.',
  'One shared standard.': 'یو ګډ معیار.',
  'Four focused companies.': 'څلور تخصصي شرکتونه.',
  'One powerful group.': 'یو پیاوړی ګروپ.',
  'Explore division': 'برخه وګورئ',
  'Built around useful service, not unnecessary complexity.': 'د ګټورو خدمتونو پر بنسټ، نه غیرضروري پیچلتیا.',
  'Account': 'حساب',
  'Escape': 'وتل',
  'services available': 'خدمتونه شته',
  'products available': 'محصولات شته',
  'stories found': 'خبرونه وموندل شول',
  'Updated': 'تازه شوی',
  'Loading product…': 'محصول بارېږي…',
}

const dictionaries: Record<Exclude<LangCode, 'en'>, Dictionary> = { fa, ps }

const textState = new WeakMap<Text, { source: string; applied: string }>()
const attrState = new WeakMap<Element, Map<string, { source: string; applied: string }>>()
let currentLanguage: LangCode = 'en'
let observer: MutationObserver | null = null
let applying = false

const translateExact = (source: string, lang: LangCode) => {
  if (lang === 'en') return source
  const dict = dictionaries[lang]
  const trimmed = source.trim()
  if (!trimmed) return source

  const direct = dict[trimmed]
  if (direct) return source.replace(trimmed, direct)

  const serviceCount = trimmed.match(/^(\d+) services available$/i)
  if (serviceCount) return lang === 'fa' ? `${serviceCount[1]} خدمت موجود` : `${serviceCount[1]} خدمتونه شته`
  const productCount = trimmed.match(/^(\d+) products available$/i)
  if (productCount) return lang === 'fa' ? `${productCount[1]} محصول موجود` : `${productCount[1]} محصولات شته`
  const storiesCount = trimmed.match(/^(\d+) stories found$/i)
  if (storiesCount) return lang === 'fa' ? `${storiesCount[1]} خبر پیدا شد` : `${storiesCount[1]} خبرونه وموندل شول`
  const categoryServices = trimmed.match(/^(Education|Travel|Technology|Media) services$/)
  if (categoryServices) {
    const cat = dict[categoryServices[1]] || categoryServices[1]
    return lang === 'fa' ? `خدمات ${cat}` : `د ${cat} خدمتونه`
  }

  const monthNames: Record<string, [string, string]> = {
    January: ['جنوری', 'جنوري'], February: ['فبروری', 'فبروري'], March: ['مارچ', 'مارچ'],
    April: ['اپریل', 'اپرېل'], May: ['می', 'مې'], June: ['جون', 'جون'],
    July: ['جولای', 'جولای'], August: ['اگست', 'اګست'], September: ['سپتامبر', 'سپتمبر'],
    October: ['اکتوبر', 'اکتوبر'], November: ['نوامبر', 'نومبر'], December: ['دسامبر', 'دسمبر'],
  }
  const monthYear = trimmed.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})$/)
  if (monthYear) {
    const month = monthNames[monthYear[1]][lang === 'fa' ? 0 : 1]
    return source.replace(trimmed, `${month} ${monthYear[2]}`)
  }
  const updatedMonthYear = trimmed.match(/^Updated\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})$/)
  if (updatedMonthYear) {
    const month = monthNames[updatedMonthYear[1]][lang === 'fa' ? 0 : 1]
    const translated = lang === 'fa' ? `به‌روزرسانی ${month} ${updatedMonthYear[2]}` : `تازه شوی ${month} ${updatedMonthYear[2]}`
    return source.replace(trimmed, translated)
  }
  const shortDate = trimmed.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{4})$/)
  if (shortDate) {
    const shortToLong: Record<string, string> = { Jan:'January', Feb:'February', Mar:'March', Apr:'April', May:'May', Jun:'June', Jul:'July', Aug:'August', Sep:'September', Oct:'October', Nov:'November', Dec:'December' }
    const month = monthNames[shortToLong[shortDate[1]]][lang === 'fa' ? 0 : 1]
    return source.replace(trimmed, `${shortDate[2]} ${month} ${shortDate[3]}`)
  }
  return source
}

function translateTextNode(node: Text, lang: LangCode) {
  const existing = textState.get(node)
  if (!existing) textState.set(node, { source: node.data, applied: node.data })
  const state = textState.get(node)!
  if (node.data !== state.applied) state.source = node.data
  const next = translateExact(state.source, lang)
  state.applied = next
  if (node.data !== next) node.data = next
}

const translatableAttributes = ['placeholder', 'title', 'aria-label']
function translateElementAttributes(el: Element, lang: LangCode) {
  let states = attrState.get(el)
  if (!states) {
    states = new Map()
    attrState.set(el, states)
  }
  translatableAttributes.forEach((attr) => {
    if (!el.hasAttribute(attr)) return
    const value = el.getAttribute(attr) || ''
    let state = states!.get(attr)
    if (!state) {
      state = { source: value, applied: value }
      states!.set(attr, state)
    } else if (value !== state.applied) {
      state.source = value
    }
    const next = translateExact(state.source, lang)
    state.applied = next
    if (value !== next) el.setAttribute(attr, next)
  })
}

function walk(root: ParentNode, lang: LangCode) {
  if (root instanceof Element) translateElementAttributes(root, lang)
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
  let node: Node | null = walker.currentNode
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node as Text, lang)
    else if (node instanceof Element) translateElementAttributes(node, lang)
    node = walker.nextNode()
  }
}

export function setSiteLanguage(lang: LangCode) {
  currentLanguage = lang
  localStorage.setItem('apg-language', lang)
  const rtl = lang === 'fa' || lang === 'ps'
  document.documentElement.lang = lang
  document.documentElement.dir = rtl ? 'rtl' : 'ltr'
  document.documentElement.dataset.language = lang
  document.body.classList.toggle('is-rtl', rtl)
  window.dispatchEvent(new CustomEvent<LangCode>('apg-language-change', { detail: lang }))

  applying = true
  walk(document.body, lang)
  applying = false

  if (!observer) {
    observer = new MutationObserver((mutations) => {
      if (applying) return
      applying = true
      for (const mutation of mutations) {
        if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
          translateTextNode(mutation.target as Text, currentLanguage)
        }
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) translateTextNode(node as Text, currentLanguage)
          else if (node instanceof Element) walk(node, currentLanguage)
        })
        if (mutation.type === 'attributes' && mutation.target instanceof Element) translateElementAttributes(mutation.target, currentLanguage)
      }
      applying = false
    })
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: translatableAttributes })
  }
}

export function getSavedLanguage(): LangCode {
  const saved = localStorage.getItem('apg-language')
  return saved === 'fa' || saved === 'ps' ? saved : 'en'
}
