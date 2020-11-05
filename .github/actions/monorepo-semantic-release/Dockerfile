FROM node:12-slim

LABEL "com.github.actions.name"="monorepo-semantic-release"

# Copy the rest of your action's code
COPY . .

RUN yarn
RUN yarn build

# Run `node /index.js`
ENTRYPOINT ["node", "lib/index.js"]
