import formatHtml from 'gulp-format-html';
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from "gulp-version-number";
import nunjucksRender from 'gulp-nunjucks-render';
import nunjucksIncludeData from 'nunjucks-includeData';

export const html = () => {
	return app.gulp.src(app.path.src.html)
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "HTML",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(nunjucksRender())
		.pipe(
			webpHtmlNosvg()
		)
		.pipe(formatHtml())
		.pipe(
			app.plugins.if(
				app.isBuild,
				versionNumber({
					'value': '%DT%',
					'append': {
						'key': '_v',
						'cover': 0,
						'to': [
							'css',
							'js',
						]
					},
					'output': {
						'file': 'gulp/version.json'
					}
				})
			)
		)
		.pipe(app.gulp.dest(app.path.build.html))
		.pipe(app.plugins.browsersync.stream());
}

