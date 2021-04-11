import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGXLinkAttributes,
  SVGPresentationAttributes,
  HTMLAttributeReferrerPolicy,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGAAttributes
  extends SVGCommonAttributes<SVGAElement>,
    SVGStyleAttributes,
    SVGXLinkAttributes,
    SVGPresentationAttributes,
    SVGConditionalProcessingAttributes {
  /**
   * Instructs browsers to download a URL instead of navigating to it, so the
   * user will be prompted to save it as a local file.
   */
  download?: string
  /**
   * The URL or URL fragment the hyperlink points to.
   */
  href?: string
  /**
   * The human language of the URL or URL fragment that the hyperlink points to.
   */
  hrefLang?: string
  /**
   * A space-separated list of URLs to which, when the hyperlink is followed,
   * POST requests with the body PING will be sent by the browser (in the
   * background). Typically used for tracking.
   */
  ping?: string
  /**
   * The relationship of the target object to the link object.
   */
  ref?: string
  /**
   * Where to display the linked URL.
   */
  target?: string
  /**
   * A MIME type for the linked URL.
   */
  type?: string
  /**
   * Which referrer to send when fetching the URL.
   */
  referrerPolicy?: HTMLAttributeReferrerPolicy
}
