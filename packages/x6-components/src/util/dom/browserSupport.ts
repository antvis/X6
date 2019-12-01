import { getVendorPrefix } from './getVendorPrefix'

export const hasCSSAnimations = () => !!getVendorPrefix('animationName')
export const hasCSSTransitions = () => !!getVendorPrefix('transition')
export const hasCSSTransforms = () => !!getVendorPrefix('transform')
export const hasCSS3DTransforms = () => !!getVendorPrefix('perspective')
