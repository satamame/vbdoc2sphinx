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

''' <summary>サンプルプロシージャ</summary>
''' <param name="number">数字</param>
''' <remarks>
''' 返り値はありません。
''' 複数行の remarks.
''' </remarks>
Sub サンプルプロシージャ(ByVal number As Integer)
    Debug.Print "sampleProcedure running."
    sampleProcedure = number * 2
End Sub
