import { configure } from '@storybook/react'
import '../src/App/style/index.css'
function loadStories () {
  require('../src/App/views/ManageOrders/components/OrderListing/story.js')
}

configure(loadStories, module)
