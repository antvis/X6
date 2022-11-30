import React from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '@antv/gatsby-theme-antv/site/components/Seo'
import Banner from '@antv/gatsby-theme-antv/site/components/Banner'
import Companies from '@antv/gatsby-theme-antv/site/components/Companies'
import Features from '@antv/gatsby-theme-antv/site/components/Features'
import { Modal } from 'antd'
import './index.less'

const IndexPage = () => {
  const { t, i18n } = useTranslation()
  const features = [
    {
      icon: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*aiSwSLVyR14AAAAAAAAAAAAAARQnAQ',
      title: t('快速上手，极易定制'),
      description: t('提供基于低学习成本的 SVG/HTML/CSS 的节点定制能力'),
    },
    {
      icon: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*zNTESJL7HJgAAAAAAAAAAAAAARQnAQ',
      title: t('组件完备，开箱即用'),
      description: t('内置 10+ 图编辑场景的配套扩展，如框选、对齐线、小地图等'),
    },
    {
      icon: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*vQNVQoydZIIAAAAAAAAAAAAAARQnAQ',
      title: t('灵活，可扩展'),
      description: t(
        '画布、节点、边、属性、工具等均可以通过注册机制自由、灵活扩展',
      ),
    },
  ]
  const companies = [
    {
      name: '阿里云',
      img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*V_xMRIvw2iwAAAAAAAAAAABkARQnAQ',
    },
    {
      name: '支付宝',
      img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*lYDrRZvcvD4AAAAAAAAAAABkARQnAQ',
    },
    {
      name: '天猫',
      img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*BQrxRK6oemMAAAAAAAAAAABkARQnAQ',
    },
    {
      name: '淘宝网',
      img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*1l8-TqUr7UcAAAAAAAAAAABkARQnAQ',
    },
    {
      name: '网商银行',
      img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*ZAKFQJ5Bz4MAAAAAAAAAAABkARQnAQ',
    },
    {
      name: '京东',
      img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*yh-HRr3hCpgAAAAAAAAAAABkARQnAQ',
    },
    {
      name: 'yunos',
      img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*_js7SaNosUwAAAAAAAAAAABkARQnAQ',
    },
    {
      name: '菜鸟',
      img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*TgV-RZDODJIAAAAAAAAAAABkARQnAQ',
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

  const notifications = [
    {
      type: 'News',
      title: 'X6 2.0 来了！',
      date: '2022.11.22',
      link: 'https://www.yuque.com/antv/operation/bgo171',
    },
  ]

  React.useEffect(() => {
    Modal.confirm({
      content: 'X6 2.0 已经发布了🎉🎉🎉，是否跳转到 2.0 新版官网?',
      title: '小提醒',
      cancelText: '取消',
      okText: '前往',
      onOk() {
        window.location.href = 'https://x6.antv.antgroup.com'
      },
    })
  }, [])

  return (
    <>
      <SEO title={t('X6 图编辑引擎')} titleSuffix="AntV" lang={i18n.language} />
      <Banner
        coverImage={
          <img
            style={{ marginTop: 80 }}
            src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*tDVBQoFQkskAAAAAAAAAAAAAARQnAQ"
            alt="X6"
          />
        }
        title={t('X6 图编辑引擎')}
        description={t(
          'X6 是 AntV 旗下的图编辑引擎，提供了一系列开箱即用的交互组件和简单易用的节点定制能力，方便我们快速搭建 DAG 图、ER 图、流程图等应用。',
        )}
        buttons={bannerButtons}
        notifications={notifications}
        className="banner"
      />
      <Features features={features} style={{ width: '100%' }} />
      <Companies title={t('感谢信赖')} companies={companies} />
    </>
  )
}

export default IndexPage
