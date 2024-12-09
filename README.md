# vbdoc2sphinx VSCode extension

Insert Sphinx's Function directive based on clipboard if Visual Basic's document comment (XML style) has been copied.

## Installation

1. Open VSCode Extensions panel.
1. "Install from VSIX..." from "..." in upper right corner.
1. Select "vbdoc2sphinx-x.x.x.vsix".

## Usage

1. Copy Visual Basic document comment through the Function/Sub declaration to clipboard.
    ```
    ''' <summary>This is sample function</summary>
    ''' <param name="number">The number</param>
    ''' <returns>doubled number</returns>
    ''' <remarks>This function is not important.</remarks>
    Public Function sampleFunc(ByVal number As Integer) _
            As Integer
    ```
1. Execute "Paste VB Doc as Function Directive" from VSCode command palette.
1. Result
    1. for reStructuredText
        ```
        .. function:: Public Function sampleFunc(ByVal number As Integer) As Integer

           This is sample function

           :param number: The number
           :type number: Integer
           :returns: doubled number
           :rtype: Integer

           This function is not important.
        ```
    1. for Markdown
        ````
        ```{function} Public Function sampleFunc(ByVal number As Integer) As Integer

        This is sample function

        :param number: The number
        :type number: Integer
        :returns: doubled number
        :rtype: Integer

        This function is not important.
        ```
        ````
