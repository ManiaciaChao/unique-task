#include <stdio.h>

#define length(x) (sizeof x) / (sizeof x[0])
#define bubbleSort(x) bubbleSort_(x, length(x))
#define insertSort(x) insertSort_(x, length(x))
#define mergeSort(x) mergeSort_(x, 1, length(x), mSbuffer)
#define quickSort(x) quickSort_(x, 0, length(x) - 1)
#define heapSort(x) heapSort_(x, length(x))

void swap(int *x, int *y) {
    int t = *x;
    *x = *y;
    *y = t;
}

void bubbleSort_(int a[], int len) {
    int i;
    for (; len >= 0; len--) {
        for (i = 0; i < len - 1; i++) {
            if (a[i] > a[i + 1]) {
                swap(&a[i], &a[i + 1]);
            }
        }
    }
}

void insertSort_(int x[], int len) {  // wtf is len!
    int i, j, cur;
    for (i = 1; i < len; i++) {
        cur = x[i];
        j = i - 1;  // from the back to the forward
        for (j; j >= 0 && x[j] > cur; j--) {
            x[j + 1] = x[j];
        }
        x[j + 1] = cur;
    }
}

int mSbuffer[];
void mergeSort_(int *A, int x, int y, int *T) {
    if (y - x > 1) {
        int m = x + (y - x) / 2;
        int p = x, q = m, i = x;
        mergeSort_(A, x, m, T);
        mergeSort_(A, m, y, T);
        while (p < m || q < y) {
            if (q >= y || (p < m && A[p] <= A[q])) {
                T[i++] = A[p++];
            } else {
                T[i++] = A[q++];
            }
        }
        for (i = x; i < y; i++) {
            A[i] = T[i];
        }
    }
}

int partition(int a[], int l, int r, int pIndex) {  // p is for pivot
    int pValue = a[pIndex];
    swap(&a[pIndex], &a[r]);
    int storeIndex = l;
    // /printf("%d",storeIndex);
    int i;
    for (i = l; i <= r - 1; i++) {
        if (a[i] < pValue) {
            swap(&a[storeIndex], &a[i]);
            storeIndex += 1;
        }
    }
    swap(&a[r], &a[storeIndex]);
    return storeIndex;
}
void quickSort_(int a[], int l, int r) {
    int pIndex = r, nIndex;
    if (r > l) {
        nIndex = partition(a, l, r, pIndex);
        quickSort_(a, l, nIndex - 1);
        quickSort_(a, nIndex + 1, r);
    }
}

void maxHeapify(int a[], int l, int r) {
    int parent = l;
    int child = 2 * parent + 1;
    while (child <= r) {
        if (child + 1 <= r &&
            a[child] <= a[child + 1]) {  // only select the maxium
            child++;
        } else if (a[parent] > a[child]) {
            return;
        } else {
            swap(&a[parent], &a[child]);
            parent = child;
            child = parent * 2 + 1;
        }
    }
}
void heapSort_(int a[], int len) {
    int i;
    for (i = len / 2 - 1; i >= 0; i--) { // from the last parent
        maxHeapify(a, i, len - 1);
    }
    for (i = len - 1; i > 0; i--) {
        swap(&a[0], &a[i]); // because line 87
        maxHeapify(a, 0, i - 1);
    }
}

int main() {
    int array[] = {1, 3, 4142, 123, 4, 1, 41, 12315, 31135, 234};
    int i;
    // bubbleSort(array);
    // mergeSort(array);
    // quickSort(array);
    // heapSort(array);
    for (i = 0; i < length(array); i++) {
        printf("%d ", array[i]);
    }
    printf("\n");
    return 0;
}