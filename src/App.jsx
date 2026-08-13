import { useMemo } from 'react'
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  Clock,
  Folder,
  Grid2X2,
  Home as HomeIcon,
  Info,
  LayoutList,
  ListFilter,
  Mail,
  PenLine,
  Search,
  Share2,
  SlidersHorizontal,
  Tag,
  Users,
} from 'lucide-react'
import data from './posts.json'
import './App.css'

const { posts, categories, siteInfo } = data
const pageSize = 6

function formatDate(value) {
  return new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

function getSections(content) {
  return content
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => line.replace('## ', '').trim())
}

function renderContent(content) {
  let sectionIndex = 0

  return content.split('\n\n').map((block) => {
    if (block.startsWith('## ')) {
      const title = block.replace('## ', '').trim()
      sectionIndex += 1
      return (
        <h2 key={title} id={`section-${sectionIndex}`}>
          <Camera size={24} />
          {title}
        </h2>
      )
    }

    return <p key={block}>{block}</p>
  })
}

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<StaticPage title="سياسة الخصوصية" />} />
          <Route path="/terms" element={<StaticPage title="شروط الاستخدام" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <Link to="/" className="brand" aria-label="عدسة - الصفحة الرئيسية">
          <span className="brand-mark">ع</span>
          <span>
            <strong>{siteInfo.name}</strong>
            <small>{siteInfo.tagline}</small>
          </span>
        </Link>

        <nav className="main-nav" aria-label="التنقل الرئيسي">
          <NavLink to="/">الرئيسية</NavLink>
          <NavLink to="/blog">المدونة</NavLink>
          <NavLink to="/about">من نحن</NavLink>
        </nav>

        <div className="header-actions">
          <Link to="/blog" className="icon-button" aria-label="البحث في المقالات">
            <Search size={20} />
          </Link>
          <Link to="/blog" className="primary-button">
            إبدأ القراءة
          </Link>
        </div>
      </div>
    </header>
  )
}

function Home() {
  const featured = posts.filter((post) => post.featured).slice(0, 3)
  const latest = posts.slice(3, 6)

  return (
    <>
      <section className="hero-section">
        <div className="grid-layer" />
        <div className="container hero-content">
          <span className="eyebrow">مرحبا بك في عدسة</span>
          <h1>
            اكتشف فن
            <span> التصوير الفوتوغرافي</span>
          </h1>
          <p>انغمس في أسرار المحترفين ونصائح عملية لتطوير مهاراتك في التصوير.</p>
          <div className="hero-actions">
            <Link to="/blog" className="primary-button">
              استكشف المقالات
              <ArrowLeft size={18} />
            </Link>
            <Link to="/about" className="ghost-button">
              اعرف المزيد
              <Info size={18} />
            </Link>
          </div>
          <div className="stats-row" aria-label="إحصائيات المدونة">
            <Stat icon={PenLine} value="6" label="كاتب" />
            <Stat icon={Folder} value={categories.length} label="تصنيفات" />
            <Stat icon={Users} value="+10 ألف" label="قارئ" />
            <Stat icon={ListFilter} value={`${posts.length}+`} label="مقالة" />
          </div>
        </div>
      </section>

      <SectionIntro eyebrow="مميز" title="مقالات مختارة" text="محتوى منتقى لبدء رحلة تعلمك" />
      <section className="container featured-list">
        {featured.map((post) => (
          <FeaturedPost key={post.id} post={post} />
        ))}
      </section>

      <SectionIntro eyebrow="التصنيفات" title="استكشف حسب الموضوع" text="اعثر على محتوى مصمم حسب اهتماماتك" />
      <CategoryGallery />

      <SectionIntro eyebrow="الأحدث" title="أحدث المقالات" text="محتوى جديد طازج من المدونة" />
      <section className="container card-grid compact-grid">
        {latest.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
      <Newsletter />
    </>
  )
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="stat-card">
      <Icon size={24} />
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function SectionIntro({ eyebrow, title, text }) {
  return (
    <div className="container section-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  )
}

function FeaturedPost({ post }) {
  return (
    <article className="featured-post">
      <Link to={`/blog/${post.slug}`} className="featured-image">
        <img src={post.image} alt={post.title} />
        <span>{post.category}</span>
      </Link>
      <div className="featured-copy">
        <div className="meta">
          <span>
            <Clock size={16} />
            {post.readTime}
          </span>
          <span>{post.category}</span>
        </div>
        <h3>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
        <div className="post-footer">
          <Author author={post.author} />
          <Link to={`/blog/${post.slug}`} className="read-link">
            اقرأ المقال
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}

function CategoryGallery() {
  const icons = [SlidersHorizontal, Users, Camera, PenLine, Folder]

  return (
    <section className="container category-gallery">
      {categories.map((category, index) => {
        const Icon = icons[index % icons.length]

        return (
          <Link
            key={category.name}
            to={`/blog?category=${encodeURIComponent(category.name)}`}
            className="category-card"
          >
            <Icon size={28} />
            <strong>{category.name}</strong>
            <span>{category.count} مقالة</span>
          </Link>
        )
      })}
    </section>
  )
}

function Blog() {
  const [params, setParams] = useSearchParams()
  const search = params.get('q') ?? ''
  const category = params.get('category') ?? 'all'
  const view = params.get('view') === 'list' ? 'list' : 'grid'
  const page = Number(params.get('page') ?? 1)

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const normalizedSearch = search.trim().toLowerCase()
      const matchesSearch =
        !normalizedSearch ||
        [post.title, post.excerpt, post.category, post.author.name, ...post.tags]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)
      const matchesCategory = category === 'all' || post.category === category

      return matchesSearch && matchesCategory
    })
  }, [category, search])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const visiblePosts = filteredPosts.slice((safePage - 1) * pageSize, safePage * pageSize)

  function updateParam(key, value) {
    const next = new URLSearchParams(params)
    if (!value || value === 'all' || (key === 'page' && value === 1)) {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    if (key !== 'page') next.delete('page')
    setParams(next)
  }

  return (
    <section className="container blog-page">
      <div className="page-heading">
        <span className="eyebrow">المدونة</span>
        <h1>كل المقالات</h1>
        <p>ابحث، صفّي، وغيّر طريقة العرض لتصل للمقال المناسب بسرعة.</p>
      </div>

      <div className="toolbar">
        <label className="search-field">
          <Search size={20} />
          <input
            type="search"
            value={search}
            onChange={(event) => updateParam('q', event.target.value)}
            placeholder="ابحث عن مقال أو كاتب..."
          />
        </label>

        <label className="select-field">
          <ListFilter size={20} />
          <select value={category} onChange={(event) => updateParam('category', event.target.value)}>
            <option value="all">كل التصنيفات</option>
            {categories.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <div className="view-toggle" aria-label="تغيير طريقة العرض">
          <button
            type="button"
            className={view === 'grid' ? 'active' : ''}
            onClick={() => updateParam('view', 'grid')}
            aria-label="عرض شبكي"
          >
            <Grid2X2 size={20} />
          </button>
          <button
            type="button"
            className={view === 'list' ? 'active' : ''}
            onClick={() => updateParam('view', 'list')}
            aria-label="عرض قائمة"
          >
            <LayoutList size={20} />
          </button>
        </div>
      </div>

      <div className="results-count">تم العثور على {filteredPosts.length} مقالة</div>

      {visiblePosts.length > 0 ? (
        <div className={view === 'list' ? 'post-list' : 'card-grid'}>
          {visiblePosts.map((post) =>
            view === 'list' ? <PostListItem key={post.id} post={post} /> : <PostCard key={post.id} post={post} />,
          )}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={40} />
          <h2>لا توجد مقالات مطابقة</h2>
          <p>جرّب كلمة بحث مختلفة أو اختر تصنيف آخر.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination" aria-label="ترقيم الصفحات">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
            <button
              type="button"
              key={item}
              className={item === safePage ? 'active' : ''}
              onClick={() => updateParam('page', item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function PostCard({ post }) {
  return (
    <article className="post-card">
      <Link to={`/blog/${post.slug}`} className="post-image">
        <img src={post.image} alt={post.title} />
        <span>{post.category}</span>
      </Link>
      <div className="post-card-body">
        <div className="meta">
          <span>
            <Clock size={15} />
            {post.readTime}
          </span>
          <span>
            <Calendar size={15} />
            {formatDate(post.date)}
          </span>
        </div>
        <h2>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.excerpt}</p>
        <div className="post-footer">
          <Author author={post.author} />
          <Link to={`/blog/${post.slug}`} className="circle-link" aria-label={`اقرأ ${post.title}`}>
            <ArrowLeft size={18} />
          </Link>
        </div>
      </div>
    </article>
  )
}

function PostListItem({ post }) {
  return (
    <article className="post-list-item">
      <Link to={`/blog/${post.slug}`} className="list-image">
        <img src={post.image} alt={post.title} />
      </Link>
      <div>
        <div className="meta">
          <span>{post.category}</span>
          <span>
            <Clock size={15} />
            {post.readTime}
          </span>
        </div>
        <h2>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.excerpt}</p>
        <div className="post-footer">
          <Author author={post.author} />
          <Link to={`/blog/${post.slug}`} className="read-link">
            اقرأ المقال
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}

function BlogDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const post = posts.find((item) => item.slug === slug)

  if (!post) return <NotFound />

  const sections = getSections(post.content)
  const related = posts
    .filter((item) => item.category === post.category && item.slug !== post.slug)
    .slice(0, 3)

  return (
    <article className="details-page">
      <section className="details-hero" style={{ backgroundImage: `url(${post.image})` }}>
        <div className="container details-hero-content">
          <div className="breadcrumb">
            <Link to="/">
              <HomeIcon size={16} />
            </Link>
            <ArrowLeft size={14} />
            <Link to="/blog">المدونة</Link>
            <ArrowLeft size={14} />
            <span>{post.category}</span>
          </div>
          <div className="details-meta">
            <span>{post.category}</span>
            <span>
              <Calendar size={16} />
              {formatDate(post.date)}
            </span>
            <span>
              <Clock size={16} />
              {post.readTime}
            </span>
          </div>
          <h1>{post.title}</h1>
          <Author author={post.author} large />
        </div>
      </section>

      <section className="container details-layout">
        <aside className="article-sidebar">
          <div className="sidebar-box">
            <h3>
              محتويات المقال
              <LayoutList size={20} />
            </h3>
            {sections.map((section, index) => (
              <a key={section} href={`#section-${index + 1}`}>
                <span>{index + 1}</span>
                {section}
              </a>
            ))}
          </div>
          <div className="sidebar-box small-facts">
            <div>
              <Calendar size={20} />
              <strong>{formatDate(post.date)}</strong>
              <span>تاريخ النشر</span>
            </div>
            <div>
              <Clock size={20} />
              <strong>{post.readTime}</strong>
              <span>وقت القراءة</span>
            </div>
          </div>
          <button type="button" className="primary-button full-button" onClick={() => navigate('/blog')}>
            تصفح المزيد
          </button>
        </aside>

        <div className="article-content">
          <blockquote>{post.excerpt}</blockquote>
          {renderContent(post.content)}

          <div className="tags-box">
            <h3>
              الوسوم
              <Tag size={20} />
            </h3>
            <div>
              {post.tags.map((tag) => (
                <Link key={tag} to={`/blog?q=${encodeURIComponent(tag)}`}>
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="share-box">
            <h3>
              شارك المقال
              <Share2 size={20} />
            </h3>
            <button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
              نسخ الرابط
            </button>
          </div>

          <div className="author-box">
            <Author author={post.author} large />
            <p>مصور محترف شغوف بمشاركة المعرفة والخبرات في عالم التصوير الفوتوغرافي.</p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <>
          <SectionIntro eyebrow="مقالات مشابهة" title="استكشف المزيد من المحتوى المميز" text="" />
          <section className="container card-grid compact-grid">
            {related.map((item) => (
              <PostCard key={item.id} post={item} />
            ))}
          </section>
        </>
      )}
    </article>
  )
}

function Author({ author, large = false }) {
  return (
    <div className={large ? 'author large' : 'author'}>
      <img src={author.avatar} alt={author.name} />
      <span>
        <strong>{author.name}</strong>
        <small>{author.role}</small>
      </span>
    </div>
  )
}

function Newsletter() {
  return (
    <section className="container newsletter">
      <Mail size={34} />
      <h2>
        اشترك في <span>نشرتنا الإخبارية</span>
      </h2>
      <p>احصل على نصائح التصوير الحصرية ودروس جديدة مباشرة في بريدك الإلكتروني.</p>
      <form onSubmit={(event) => event.preventDefault()}>
        <input type="email" placeholder="أدخل بريدك الإلكتروني" aria-label="البريد الإلكتروني" />
        <button type="submit">اشترك الآن</button>
      </form>
    </section>
  )
}

function About() {
  return (
    <section className="container static-page">
      <span className="eyebrow">من نحن</span>
      <h1>عدسة مساحة عربية لعشاق التصوير</h1>
      <p>{siteInfo.description}</p>
      <p>نكتب عن الإضاءة، البورتريه، المناظر الطبيعية، المعدات، وتقنيات صناعة الصورة بشكل عملي وسهل التطبيق.</p>
    </section>
  )
}

function StaticPage({ title }) {
  return (
    <section className="container static-page">
      <span className="eyebrow">عدسة</span>
      <h1>{title}</h1>
      <p>هذه صفحة تعريفية إضافية ضمن المشروع وليست من المتطلبات الأساسية، لكنها موجودة حتى يكون التنقل كاملا.</p>
    </section>
  )
}

function NotFound() {
  return (
    <section className="container not-found">
      <span>404</span>
      <h1>الصفحة غير موجودة</h1>
      <p>الرابط الذي تحاول زيارته غير موجود داخل موقع عدسة.</p>
      <Link to="/" className="primary-button">
        العودة للرئيسية
        <ArrowRight size={18} />
      </Link>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="brand">
            <span className="brand-mark">ع</span>
            <span>
              <strong>{siteInfo.name}</strong>
              <small>{siteInfo.tagline}</small>
            </span>
          </Link>
          <p>{siteInfo.description}</p>
        </div>
        <div>
          <h3>استكشف</h3>
          <Link to="/">الرئيسية</Link>
          <Link to="/blog">المدونة</Link>
          <Link to="/about">من نحن</Link>
        </div>
        <div>
          <h3>التصنيفات</h3>
          {categories.slice(0, 4).map((category) => (
            <Link key={category.name} to={`/blog?category=${encodeURIComponent(category.name)}`}>
              {category.name}
            </Link>
          ))}
        </div>
        <div>
          <h3>ابق على اطلاع</h3>
          <p>اشترك للحصول على أحدث المقالات والتحديثات.</p>
          <form className="footer-form" onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="بريدك الإلكتروني" aria-label="بريدك الإلكتروني" />
            <button type="submit">اشترك</button>
          </form>
        </div>
      </div>
      <div className="container copyright">© 2026 عدسة. جميع الحقوق محفوظة.</div>
    </footer>
  )
}

export default Layout
