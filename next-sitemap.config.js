/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://aurafresh.pk",
    generateRobotsTxt: true,
    exclude: ["/admin/*", "/api/*"],
    robotsTxtOptions: {
      policies: [
        { userAgent: "*", allow: "/" },
        { userAgent: "*", disallow: ["/admin", "/api"] },
      ],
    },
  }