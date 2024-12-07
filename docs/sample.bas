Attribute VB_Name = "Module1"
Option Explicit

''' <summary>This is sample function</sample>
''' <param name="number">数字</param>
''' <returns>number を2倍した値</returns>
Public Function sampleFunc(ByVal number as Integer)
    Debug.Print "sampleFunc running."
    sampleFunc = number * 2
End Function
