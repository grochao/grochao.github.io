Table.ReplaceValue(
    #"paso_anterior",
    each [NOMBRE],
    each Text.FromBinary(Text.ToBinary([NOMBRE], 437), 1252),
    Replacer.ReplaceValue,
    {"NOMBRE"}
)
