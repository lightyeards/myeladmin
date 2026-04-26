const modules = import.meta.glob('../../../assets/icons/svg/*.svg', { eager: true })
const re = /\/([^/]+)\.svg$/

const svgIcons = Object.keys(modules).map((p) => p.match(re)[1])

export default svgIcons
