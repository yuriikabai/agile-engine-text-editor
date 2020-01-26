This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

## What is done
- Own code
- Interaction with words (but it is a bit buggy)
- Bold, italic, underline
- Virtual editor structure
- Flexible and Extendable architecture
- Accepts input

## What is not done
- Synonyms
- No indication of applied style

## Structure of content under the hood looks like:
```json
{
  "component":"span",
  "props":{"id":"1","key":"1"},
  "children":[
    {
      "component":"b",
      "props":{"id":"2","key":"2"},
      "children":"Hello. Requirements look similar to what the grammarly editor is. "
    },
    {
      "component":"i",
      "props":{"id":"3","key":"3"},
      "children":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
  ]
}
```

