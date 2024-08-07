import { html } from 'hono/html'

type Data = {
  xList: string[]
  yList: number[]
  children?: any
}

export const Layout = (props: Data) => html`<!DOCTYPE html>
<html lang="ja">
  <head>
  <meta charset="utf-8" />
  <title>kuritterweight-viewer</title>
  <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
  </head>
  <body>
  ${props.children}
  </body>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>    
  <script>
    const ctx = document.getElementById('myChart');
    const timestamps = [1,2,3];
    const weightValues = [50,60,70];
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [{
          label: 'kuritterweight',
          data: weightValues,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 50,
            max: 70
          }
        }
      }
    });
  </script>
</html>`

export const HomeContent = (props: {
  Data: Data,
}) => (
  <Layout {...props.Data}>
    <header>
      <h1>kuritterweight-viewer</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/blog">Blog</a>
        <a href="/notes">Notes</a>
        <a href="/guestbook">Guestbook</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
    <canvas id="myChart"></canvas>
  </Layout>
)