Attribute VB_Name = "Module1"
Option Explicit

''' <summary>This is sample function</summary>
''' <param name="number">数字</param>
''' <returns>number を2倍した値</returns>
''' <remarks>この関数は必要ないかも。</remarks>
''' <remarks name="aa">この関数は削除するかも。</remarks>
Public Function sampleFunc(ByVal number As Integer) _
        As Integer
    Debug.Print "sampleFunc running."
    sampleFunc = number * 2
End Function
