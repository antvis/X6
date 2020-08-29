import React from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '@antv/gatsby-theme-antv/site/components/Seo'
import Banner from '@antv/gatsby-theme-antv/site/components/Banner'
import Companies from '@antv/gatsby-theme-antv/site/components/Companies'
import Features from '@antv/gatsby-theme-antv/site/components/Features'
import Cases from '@antv/gatsby-theme-antv/site/components/Cases'
import './index.less'

const IndexPage = () => {
  const { t, i18n } = useTranslation()
  const features = [
    {
      icon:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*4x_KTKyqwJgAAAAAAAAAAABkARQnAQ',
      title: t('千变万化，自由组合'),
      description: t('任何图表，都可以基于图形语法灵活绘制，满足你无限的创意'),
    },
    {
      icon:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*ELYbTIVCgPoAAAAAAAAAAABkARQnAQ',
      title: t('专业完备'),
      description: t(
        '大量产品实践之上，提供绘图引擎、完备图形语法、专业设计规范',
      ),
    },
    {
      icon:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*_riSQZrgczgAAAAAAAAAAABkARQnAQ',
      title: t('生动，可交互'),
      description: t('强大的交互语法，助力可视分析，让图表栩栩如生'),
    },
  ]
  const companies = [
    {
      name: '阿里云',
      img:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*V_xMRIvw2iwAAAAAAAAAAABkARQnAQ',
    },
    {
      name: '支付宝',
      img:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*lYDrRZvcvD4AAAAAAAAAAABkARQnAQ',
    },
    {
      name: '天猫',
      img:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*BQrxRK6oemMAAAAAAAAAAABkARQnAQ',
    },
    {
      name: '淘宝网',
      img:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*1l8-TqUr7UcAAAAAAAAAAABkARQnAQ',
    },
    {
      name: '网上银行',
      img:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*ZAKFQJ5Bz4MAAAAAAAAAAABkARQnAQ',
    },
    {
      name: '京东',
      img:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*yh-HRr3hCpgAAAAAAAAAAABkARQnAQ',
    },
    {
      name: 'yunos',
      img:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*_js7SaNosUwAAAAAAAAAAABkARQnAQ',
    },
    {
      name: '菜鸟',
      img:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*TgV-RZDODJIAAAAAAAAAAABkARQnAQ',
    },
  ]
  const bannerButtons = [
    {
      text: t('图表示例'),
      link: `/${i18n.language}/examples/gallery`,
      type: 'primary',
    },
    {
      text: t('开始使用'),
      link: `/${i18n.language}/docs/tutorial/getting-started`,
    },
  ]

  const cases = [
    {
      logo:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*-dLnTIexOxwAAAAAAAAAAABkARQnAQ',
      title: t('精品 Gallery'),
      description: t(
        '真实的数据可视化案例，我们将它们归纳为一个个故事性的设计模板，让用户达到开箱即用的效果。',
      ),
      link: `/${i18n.language}/examples/gallery/line`,
      image:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*hDrgRb7ma4EAAAAAAAAAAABkARQnAQ',
    },
  ]

  const notifications = [
    {
      type: 'News',
      title: 'G2 4.0 正式发布！',
      date: '2020.03.02',
      link: 'https://www.yuque.com/antv/blog/g2-4.0-released',
    },
  ]

  return (
    <>
      <SEO title={t('X6 图编辑引擎')} titleSuffix="AntV" lang={i18n.language} />
      <Banner
        coverImage={
          <img
            width="100%"
            style={{ marginLeft: '100px', marginTop: '40px' }}
            src="https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*wo_LToatmbwAAAAAAAAAAABkARQnAQ"
          />
        }
        title={t('X6')}
        description={t('X6 是一个简单、易用、完备的图编辑引擎。')}
        buttons={bannerButtons}
        notifications={notifications}
        className="banner"
      />
      <Features features={features} style={{ width: '100%' }} />
      <Cases cases={cases} />
      <Companies title={t('感谢信赖')} companies={companies} />
    </>
  )
}

export default IndexPage
