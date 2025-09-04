import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import mediumZoom from 'medium-zoom';

const className = '.markdown :not(a) > img'

export default (function () {
  if (!ExecutionEnvironment.canUseDOM || window === undefined) {
    return
  }

  return {
    onRouteDidUpdate({location}) {
      if (location && location.hash && location.hash.length) {
        return;
      }

      mediumZoom(className, {
        // This is the height of the nav header
        margin: 51,
        background: 'rgb(50, 50, 50)'
      })
    }
  }
})()

