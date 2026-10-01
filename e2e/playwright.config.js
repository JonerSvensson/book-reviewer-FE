const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
        testDir: "./tests",
        use: {
                baseURL: "http://127.0.0.1:5500",
                headless: true,
        },
        webServer: {
                command: "npx serve -l 5500 ..",
                url: "http://127.0.0.1:5500",
                reuseExistingServer: !process.env.CI,
        },
});