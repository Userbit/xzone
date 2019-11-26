import convict from "convict";
import dotenv from "dotenv";

// read .env file, parse the contents, assign it to process.env
const result = dotenv.config();
if (result.error) {
  throw result.error;
}

// Define a schema
const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  baseUrl: {
    doc: "Base Url of source.",
    format: "url",
    default: null,
    env: "BASE_URL",
  },

  ip: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "IP_ADDRESS",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8080,
    env: "PORT",
    arg: "port",
  },
  db: {
    host: {
      doc: "Database host name/IP",
      format: "*",
      default: "server1.dev.test",
    },
    name: {
      doc: "Database name",
      format: String,
      default: "users",
    },
  },
});

// Load environment dependent configuration
const env = config.get("env");
config.loadFile(`./config/${env}.json`);

// Perform validation
config.validate({ allowed: "strict" });

export default config;
