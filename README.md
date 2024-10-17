<h1 align="center">Ephrem</h1>

<p align="center">Ephrem is a lightweight NodeJS and TypeScript API wrapper for API.Bible that validates Bible references and retrieves the corresponding scripture text.</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 2" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-2-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/stevin-wilson/ephrem/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/stevin-wilson/ephrem" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/stevin-wilson/ephrem?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/stevin-wilson/ephrem/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/ephrem"><img alt="📦 npm version" src="https://img.shields.io/npm/v/ephrem?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

Ephrem is a powerful, lightweight NodeJS package designed to provide seamless access to the Bible’s rich and diverse
content from multiple translations and languages, leveraging the API.Bible service.
Whether you are a developer creating Bible-based applications, a scholar seeking quick access to scripture, or a layperson wanting to deepen
your understanding of the Word, Ephrem allows you to easily fetch Bible passages using standard references.
It supports both modern and ancient translations, making it an invaluable resource for all.

This package is uniquely equipped to handle citations in left-to-right (LTR) and right-to-left (RTL) scripts,
making it essential for users across various linguistic backgrounds, including English, Arabic, Malayalam, and
more.
Additionally, Ephrem allows you to customize Bible abbreviations, ensuring your application or study tool can
adapt to local preferences and regional variations in Bible translation names.

**Ephrem will remain non-commercial and open-source, dedicated to glorifying God and providing accessible
scripture for everyone.**

## Features

1. _Multilingual Support with RTL/LTR Compatibility_

Ephrem accommodates citations in various languages, recognizing both left-to-right (LTR) and right-to-left (RTL)
scripts.
This ensures that users around the world can access scripture in their native languages and scripts without
losing accuracy or clarity.
Examples include:

- "John 3-4 (KJV)" or "(KJV) إنجيل يوحنا 3-4" to retrieve the same passages from the Gospel of John, Chapters 3-4, in the King James Version (KJV).
- "John 3-4 (MAL10RO)", "യോഹന്നാൻ 3-4 (MAL10RO)" or "(MAL10RO) إنجيل يوحنا 3-4" to fetch the same chapters in the Malayalam Sathyavedapusthakam (മലയാളം സത്യവേദപുസ്തകം) 1910 Edition.

2. _Customizable Bible Abbreviations_

The package offers flexibility in specifying custom Bible abbreviations, allowing users to override default
abbreviations with those more familiar to their region or language.

For example, if the official abbreviation of a Bible is in English characters, you can define a
local-language abbreviation that suits your needs.

3. _Passage Options for Flexible Output_

Ephrem supports the options from API.Bible to control the format and content of the retrieved scripture text.
These options give you control over how much information is displayed, whether you want a plain text version of
scripture or a more detailed format that includes chapter and verse numbers, notes, and titles.

4. _Support for Deuterocanonical Books and USFM Codes_

- Ephrem makes it easy to fetch passages from the Deuterocanonical books, ensuring that translations and traditions
  that include these additional texts are fully supported.
- It also supports citations using USFM Book codes, widely used in many digital Bible formats, ensuring
  compatibility with a variety of Bible texts and formats.

5. _Integration with Other Tools_

Ephrem can easily be integrated with frameworks like MDX and React to display and share scripture on web applications.
This allows developers to create interactive Bible study tools, responsive applications, and engaging
content that can enhance spiritual learning.

## Usage

### Installation

To install Ephrem, run the following command:

```shell
npm i ephrem
```

### Setup (One-time Configuration)

Before using Ephrem, you’ll need to configure it by fetching Bible and book data for the languages you need from
API.Bible.
The package requires the API.Bible API key to be set as an environment variable.

#### Setting the API_BIBLE_API_KEY Environment Variable

Follow the steps below based on your platform to set the environment variable.

##### Windows

1. Open Start and search for “Environment Variables”.
2. Click on Edit the system environment variables.
3. In the System Properties window, click Environment Variables.
4. Under User variables, click New.
5. Set the Variable name to `API_BIBLE_API_KEY` and the Variable value to your API.Bible key.
6. Click OK to save.

Alternatively, if you are using PowerShell, you can set it temporarily with:

```shell
$env:API_BIBLE_API_KEY = "your-api-bible-key"
```

##### macOS / Linux

1. Open a Terminal.
2. Use the following command to set the environment variable temporarily (only for the current session):

```shell
export API_BIBLE_API_KEY="your-api-bible-key"
```

3. To set the environment variable permanently, add the above line to your shell configuration file:

- If using bash, add it to your `~/.bashrc` or `~/.bash_profile`.
- If using zsh, add it to your `~/.zshrc`.

#### Setting Up Ephrem

Once the environment variable is set, use the `setupEphrem` function to fetch and store Bible data for the languages you need:

```ts
import { setupEphrem } from "ephrem";

setupEphrem(["eng", "ara"])
	.then((path) => console.log(`Bible data stored at: ${path}`))
	.catch((err) => console.error(`Setup failed: ${err.message}`));
```

Here, `eng` and `ara` are the ISO-639-3 language codes for English and Arabic, respectively.
The API key is securely picked up from the `API_BIBLE_API_KEY` environment variable.
This setup will download the necessary Bible data and store it for efficient future use.

### Fetching a Bible Passage

To retrieve a Bible passage with additional details about the Bible and the Book referenced, use the
`getPassageWithDetails` function.
The second parameter allows you to pass in custom PassageOptions (such as `contentType`: `text`), giving you control
over the format of the retrieved passage.

```ts
import { getPassageWithDetails } from "ephrem";

getPassageWithDetails("John 3:16 (KJV)", {
	contentType: "text",
	includeTitles: false,
})
	.then((details) => {
		console.log(`- - ${details.passage.reference} - -`);
		console.log(details.passage.content);
	})
	.catch((err) => console.error(`Error fetching passage: ${err.message}`));
```

```plaintext
- - John 3:16 - -
     [16] ¶ For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.
```

```ts
import { getPassageWithDetails } from "ephrem";

getPassageWithDetails("Tobit 13:6 (engLXXup)", {
	contentType: "text",
	includeTitles: false,
})
	.then((details) => {
		console.log(`- - ${details.passage.reference} - -`);
		console.log(details.passage.content);
	})
	.catch((err) => console.error(`Error fetching passage: ${err.message}`));
```

```plaintext
- - Tobit 13:6 - -
     [6] If ye turn to him with your whole heart, and with your whole mind, and deal uprightly before him, then will he turn unto you, and will not hide his face from you. Therefore see what he will do with you, and confess him with your whole mouth, and praise the Lord of might, and extol the everlasting King. In the land of my captivity do I praise him, and declare his might and majesty to a sinful nation. O ye sinners, turn and do justice before him: who can tell if he will accept you, and have mercy on you?
```

```ts
import { getPassageWithDetails } from "ephrem";

getPassageWithDetails("Genesis 1:1-2 (MAL10RO)", {
	contentType: "text",
	includeTitles: false,
})
	.then((details) => {
		console.log(`- - ${details.passage.reference} - -`);
		console.log(details.passage.content);
	})
	.catch((err) => console.error(`Error fetching passage: ${err.message}`));
```

```plaintext
- - ഉല്പത്തി 1:1-2 - -
     [1] ആദിയിൽ ദൈവം ആകാശവും ഭൂമിയും സൃഷ്ടിച്ചു.  [2] ഭൂമി പാഴായും ശൂന്യമായും ഇരുന്നു; ആഴത്തിന്മീതെ ഇരുൾ ഉണ്ടായിരുന്നു. ദൈവത്തിന്റെ ആത്മാവു വെള്ളത്തിൻ മീതെ പരിവർത്തിച്ചുകൊണ്ടിരുന്നു.
```

### Customizing Bible Abbreviations

If you want to provide custom labels or abbreviations for Bible translations, you can use the
`getBibleAbbreviationsFilepath` function to retrieve the path to the Bible abbreviations file:

```ts
import { getBibleAbbreviationsFilepath } from "ephrem";

console.log(`Bible Abbreviations Filepath: ${getBibleAbbreviationsFilepath()}`);
```

This allows you to customize how users refer to different Bible versions, ensuring a more localized and
user-friendly experience.

## Contributing

We welcome contributions from developers, theologians, and anyone interested in improving access to the
scriptures.
Please feel free to submit pull requests or report issues.

## License

Ephrem is licensed under the MIT License, which is widely regarded as one of the most user-friendly
open-source licenses.
Here’s why:

- **Freedom to Use**: You are free to use, copy, modify, and distribute this package in both personal
  and commercial projects without restrictions.
- **Minimal Restrictions**: The license ensures you can build upon the package or integrate it into
  larger applications, while simply requiring that the original license text is retained in the distribution.
- **Flexibility for Innovation**: The MIT License encourages collaboration and innovation by making it
  easy for developers and scholars to adapt Ephrem to their specific needs, without legal concerns.
- **Open to Contributions**: You can contribute back to the project or fork it, fostering a community of
  shared knowledge.

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com/"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/stevin-wilson"><img src="https://avatars.githubusercontent.com/u/55603058?v=4?s=100" width="100px;" alt="Stevin Wilson"/><br /><sub><b>Stevin Wilson</b></sub></a><br /><a href="https://github.com/stevin-wilson/ephrem/commits?author=stevin-wilson" title="Code">💻</a> <a href="#content-stevin-wilson" title="Content">🖋</a> <a href="https://github.com/stevin-wilson/ephrem/commits?author=stevin-wilson" title="Documentation">📖</a> <a href="#ideas-stevin-wilson" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-stevin-wilson" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-stevin-wilson" title="Maintenance">🚧</a> <a href="#projectManagement-stevin-wilson" title="Project Management">📆</a> <a href="#tool-stevin-wilson" title="Tools">🔧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

<!-- You can remove this notice if you don't want it 🙂 no worries! -->

> 💙 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app).
