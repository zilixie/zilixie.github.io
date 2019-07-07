function fnamesort(a, b) {
    if (a.familyname < b.familyname)
        return -1;
    if (a.familyname > b.familyname)
        return 1;
    return 0;
}