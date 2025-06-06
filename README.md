# 🧪 Jekyll Admin
Jekyll-admin is an open-source plugin that provides an administrator interface for Jekyll-based websites. 
## 📚 Table of Contents

[🚀 Goal](#goal) · [🔗 Dependencies](#dependencies) · [🧪 Install Docker image](#how-to-download-and-install-the-docker-image) · [🛠️ Run Docker container](#how-to-create-and-run-a-docker-container) · [📁 Directory](#directory-structure-backend-ruby-frontend-javascript) · [🧹 Exit container and Cleanup](#how-to-stop-and-clean-up-after-execution) · [📜 License](#license)


## 🚀Goal
This jekyll-admin fork repositories aims to enhance the project by improving the development environment, strengthening security, and enriching the user experience. The following are the specific objectives to achieve this goal:

1. 🐳Modify jekyll-admin to be usable and developable in a Docker environment.

2. 🔒Identify vulnerabilities in the existing CI/CD workflow (detailed in [Issue#728 at jekyll-admin](https://github.com/jekyll/jekyll-admin/issues/728)) and establish a new workflow for detecting security vulnerabilities using two security tools: Brakeman and Bundler-audit.(detailed in [#7](https://github.com/cbnuLeehyunwoo/jekyll-admin/issues/7))

3. 🛠️Trying to resolve the persistent issue(the frontend-backend synchronization issue where the frontend displays a warning even after posts or pages are successfully updated. (detailed in [jekyll#713](https://github.com/jekyll/jekyll-admin/issues/713), [#4](https://github.com/cbnuLeehyunwoo/jekyll-admin/issues/4)) → Unfortunately, a reasonable solution could not be found, as resolving one problem often introduced new bugs, creating a cyclical challenge.([detailed in jekyll#726](https://github.com/jekyll/jekyll-admin/issues/726)).

4. ✨Innovate SimpleMDE Editor Image Insertion UX: Implement a function where dragging and dropping an image's web link into the jekyll-admin editor automatically parses it via a JavaScript event handler and converts it into Markdown image syntax (detailed in [#12](https://github.com/cbnuLeehyunwoo/jekyll-admin/issues/12))

## 🔗Dependencies
- This project relies on various external libraries and frameworks across its Node.js/JavaScript and Ruby components. You can view the detailed dependency lists below:

<details>
<summary>Node.js/JavaScript Dependencies (Click to expand)</summary> 

``` bash
# Production Dependencies

*  brace: 0.9.1
*  classnames: 2.2.6
*  highlight.js: ^9.17.1
*  isomorphic-fetch: 2.2.1
*  js-yaml: 3.13.1
*  lodash: ^4.17.20
*  moment: 2.24.0
*  prop-types: ^15.7.2
*  react: 15.4.1
*  react-ace: 4.1.5
*  react-document-title: ^2.0.3
*  react-dom: 15.4.1
*  react-dropzone: 3.10.0
*  react-hotkeys: ^0.9.0
*  react-modal: ^1.7.3
*  react-notification-system: 0.2.17
*  react-redux: 5.0.1
*  react-router: 3.0.0
*  react-router-redux: 4.0.8
*  react-textarea-autosize: ^5.1.0
*  react-widgets: 4.4.11
*  react-widgets-moment: 4.0.27
*  redux: 3.6.0
*  redux-logger: 2.6.1
*  redux-thunk: 2.1.0
*  rimraf: ^3.0.2
*  simplemde: 1.11.2
*  sortablejs: 1.8.4
*  underscore: 1.9.1

# Development Dependencies

*  bundlesize: ^0.18.0
*  coveralls: ^3.0.9
*  enzyme: ^2.6.0
*  husky: ^0.14.3
*  identity-obj-proxy: ^3.0.0
*  lint-staged: ^4.3.0
*  moment-locales-webpack-plugin: ^1.1.2
*  nock: 10.0.6
*  node-sass: 4.13.1
*  npm-run-all: 4.1.5
*  prettier: ^1.19.1
*  react-addons-test-utils: 15.4.1
*  react-app-rewire-webpack-bundle-analyzer: ^1.1.0
*  react-app-rewired: ^2.1.5
*  react-scripts: 3.4.0
*  react-test-renderer: 15.4.1
*  redux-immutable-state-invariant: 1.2.4
*  redux-mock-store: ^1.0.4
*  webpack-bundle-analyzer: ^3.6.0
```
</details>
<details>
<summary>Ruby Dependencies (Click to expand)</summary>

``` bash
# Runtime Dependencies

*  jekyll: >= 3.7, < 5.0
*  rackup: ~> 2.0
*  sinatra: ~> 4.0
*  sinatra-contrib: ~> 4.0

# Development Dependencies

*  gem-release: ~> 0.7
*  jekyll-redirect-from
*  sinatra-cross_origin: ~> 0.3

# Documentation Dependencies

*  jekyll-seo-tag
*  jekyll-sitemap

# Test Dependencies
*  jekyll: (version depends on ENV["JEKYLL_VERSION"])
*  bigdecimal: (conditional, if RUBY_VERSION >= "3.4" and JEKYLL_VERSION == "~> 3.9")
*  kramdown-parser-gfm: (conditional, if JEKYLL_VERSION == "~> 3.9")
*  rack-test: ~> 2.0
*  rake: >= 10.0
*  rspec: ~> 3.4
*  rubocop-jekyll: ~> 0.14.0
```
</details>

## 🧪How to Download and Install the Docker Image
``` text
> 1. Pull the Docker image
$ docker pull henow123/final_2021076046:v1

> 2. Verify the image
$ docker images
```
<h2 id="how-to-create-and-run-a-docker-container">🛠️How to Create and Run a Docker Container</h2>

``` text
> 1. Create and run the container in the background
> Please use the same number for both host and container ports (e.g., 4000:4000)
$ docker run -dit -p PORT_NUM:PORT_NUM henow123/final_2021076046:v1

> 2. Check running containers
$ docker ps

> 3. Access the container (Use the CONTAINER_ID identified above)
$ docker exec -it <CONTAINER_ID> bash

> 4. [IMPORTANT] Set environment variables for external access
Replace with your actual server public IP and the exposed port
# export JEKYLL_EXTERNAL_HOST=<YOUR_SERVER_PUBLIC_IP>
# export JEKYLL_EXTERNAL_PORT=<PORT_NUM>
e.g.) 
export JEKYLL_EXTERNAL_HOST=123.123.123.123
export JEKYLL_EXTERNAL_PORT=1234

> 5. Run the test server script to access jekyll-admin
# script/test-server

> 6. Access the test server externally
Local environment (Access from the same device where Docker is running):
https://localhost:<YOUR_EXTERNAL_PORT_NUMBER>/admin

Remote environment (Access from a different device):
https://[SERVER_PUBLIC_IP_ADDRESS]:<YOUR_EXTERNAL_PORT_NUMBER>/admin
```
## 📁Directory Structure (Backend: Ruby, Frontend: JavaScript)

``` bash
.
├── Gemfile # Defines the list of dependencies (Gems) for the Ruby project
├── Gemfile.lock # Records the exact versions of all Gems actually installed when bundle install is executed
├── LICENSE
├── README.md
├── Rakefile # Defines various automated tasks in Ruby, such as builds, tests, and deployments
├── _site # Output directory where static website files generated by Jekyll from source files are stored
├── appveyor.yml # AppVeyor CI (Continuous Integration) service configuration file (primarily for automating builds and tests in Windows environments)
├── bundlesize.config.json # Configuration file for monitoring and managing JavaScript bundle sizes
├── config-overrides.js # File for customizing Create React App (CRA) Webpack settings without ejecting
├── docs
│   ├── _config.yml # Configuration file for the Jekyll documentation site
├── jekyll-admin.gemspec
├── lib # Ruby source code directory
│   ├── jekyll # Jekyll-related modules or extension code
│   ├── jekyll-admin # Directory containing the core logic of the Jekyll Admin plugin
│   └── jekyll-admin.rb # Main entry point or loading file for the Jekyll Admin Gem
├── package-lock.json # Records the exact versions of Node.js dependencies (packages) installed using npm
├── package.json # Defines Node.js project metadata, dependencies, scripts, etc.
├── public
│   ├── favicon.ico
│   └── index.html # Main HTML file for the frontend application (entry point for React app)
├── screenshot.png
├── script # Directory containing various automation scripts
│   ├── bootstrap # Project initial setup and dependency installation script
│   ├── branding # Script for creating or managing branding assets
│   ├── build # Script for building the entire project or specific parts
│   ├── cibuild # General build script executed in a CI environment
│   ├── cibuild-node # Node.js/frontend-related build script executed in a CI environment
│   ├── cibuild-ruby # Ruby/backend-related build script executed in a CI environment
│   ├── docs-server # Script for starting the documentation site development server
│   ├── fmt # Script for code formatting or linting
│   ├── release # Script for automating the project release (deployment) process
│   ├── server-frontend # Script for starting the frontend development server
│   └── test-server # Script for starting the test server
├── spec # Directory containing test files for Ruby code
│   ├── fixtures # Fixed data for testing
│   ├── jekyll-admin # Test suite for the jekyll-admin Gem
│   ├── jekyll_admin_spec.rb # Main test file for the jekyll-admin Gem
│   └── spec_helper.rb # File assisting with RSpec (Ruby testing framework) test configuration
├── src # Source code directory for the frontend (React) application
└── yarn.lock # Lock file that records the exact versions of Node.js dependencies installed using Yarn (Node.js package manager)
```
## 🧹How to Stop and Clean Up After Execution
``` bash
> 1. Exit the container
# exit

> 2. Stop the container
$ docker stop <CONTAINER_ID>

> 3. Remove the container
$ docker rm <CONTAINER_ID>

> 4. Remove the image
$ docker image rm henow123/final_2021076046:v1
```
## 📜License
This project is licensed  under the terms of the [MIT License](https://opensource.org/licenses/MIT).
```
The MIT License (MIT)

Copyright 2016-present Mert Kahyaoğlu and the Jekyll Admin contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
