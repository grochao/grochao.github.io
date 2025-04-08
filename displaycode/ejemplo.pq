Table.TransformColumns(
    #"RESET - Caracteres raros en NOM_CLI", 
    {
      "NOM_CLI", 
      each if (_ = null or _ = "") then null else Text.FromBinary(Text.ToBinary(_, 437), 1252)
    }
  )